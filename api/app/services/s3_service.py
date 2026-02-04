import io
import uuid
from datetime import datetime
from typing import Optional, Tuple

import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from PIL import Image

from app.config import settings


class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.bucket = settings.s3_bucket
        self.cloudfront_domain = settings.cloudfront_domain

    def _generate_key(self, original_filename: str, folder: str = "uploads") -> str:
        ext = original_filename.rsplit(".", 1)[-1].lower() if "." in original_filename else ""
        unique_id = uuid.uuid4().hex[:12]
        timestamp = datetime.utcnow().strftime("%Y/%m/%d")
        filename = f"{unique_id}.{ext}" if ext else unique_id
        return f"{folder}/{timestamp}/{filename}"

    def _get_file_type(self, mime_type: str) -> str:
        if mime_type.startswith("image/"):
            return "image"
        elif mime_type.startswith("video/"):
            return "video"
        elif mime_type.startswith("audio/"):
            return "audio"
        elif mime_type == "application/pdf":
            return "document"
        else:
            return "other"

    def _get_cloudfront_url(self, s3_key: str) -> str:
        return f"https://{self.cloudfront_domain}/{s3_key}"

    async def upload_file(
        self,
        file: UploadFile,
        folder: str = "uploads",
        generate_thumbnail: bool = True,
    ) -> dict:
        content = await file.read()
        file_size = len(content)
        original_filename = file.filename or "unknown"
        mime_type = file.content_type or "application/octet-stream"
        file_type = self._get_file_type(mime_type)

        s3_key = self._generate_key(original_filename, folder)

        try:
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=s3_key,
                Body=content,
                ContentType=mime_type,
                CacheControl="max-age=31536000",
            )
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {e}")

        result = {
            "filename": s3_key.rsplit("/", 1)[-1],
            "original_filename": original_filename,
            "file_type": file_type,
            "mime_type": mime_type,
            "file_size": file_size,
            "s3_key": s3_key,
            "s3_bucket": self.bucket,
            "cloudfront_url": self._get_cloudfront_url(s3_key),
            "thumbnail_url": None,
            "width": None,
            "height": None,
        }

        if file_type == "image" and generate_thumbnail:
            try:
                dimensions, thumbnail_url = await self._process_image(content, s3_key)
                result["width"] = dimensions[0]
                result["height"] = dimensions[1]
                result["thumbnail_url"] = thumbnail_url
            except Exception:
                pass

        return result

    async def _process_image(
        self,
        content: bytes,
        original_key: str,
    ) -> Tuple[Tuple[int, int], Optional[str]]:
        image = Image.open(io.BytesIO(content))
        width, height = image.size

        thumbnail_url = None
        if max(width, height) > 400:
            thumb = image.copy()
            thumb.thumbnail((400, 400), Image.Resampling.LANCZOS)

            thumb_buffer = io.BytesIO()
            thumb_format = "JPEG" if image.mode == "RGB" else "PNG"
            thumb.save(thumb_buffer, format=thumb_format, quality=85)
            thumb_buffer.seek(0)

            thumb_key = original_key.replace("/uploads/", "/thumbnails/")
            if thumb_format == "JPEG" and not thumb_key.endswith(".jpg"):
                thumb_key = thumb_key.rsplit(".", 1)[0] + ".jpg"

            try:
                self.s3_client.put_object(
                    Bucket=self.bucket,
                    Key=thumb_key,
                    Body=thumb_buffer.getvalue(),
                    ContentType=f"image/{thumb_format.lower()}",
                    CacheControl="max-age=31536000",
                )
                thumbnail_url = self._get_cloudfront_url(thumb_key)
            except ClientError:
                pass

        return (width, height), thumbnail_url

    async def delete_file(self, s3_key: str) -> bool:
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=s3_key)
            return True
        except ClientError:
            return False

    async def delete_files(self, s3_keys: list[str]) -> bool:
        if not s3_keys:
            return True

        try:
            objects = [{"Key": key} for key in s3_keys]
            self.s3_client.delete_objects(
                Bucket=self.bucket,
                Delete={"Objects": objects},
            )
            return True
        except ClientError:
            return False


s3_service = S3Service()
