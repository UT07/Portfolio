"""
AWS Lambda handler for the FastAPI application.
Uses Mangum to adapt ASGI (FastAPI) to AWS Lambda + API Gateway.
"""
from mangum import Mangum
from app.main import app

# Mangum adapter: converts Lambda events → ASGI → FastAPI
handler = Mangum(app, lifespan="off")
