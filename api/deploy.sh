#!/bin/bash
# UTWorld API — Deploy to AWS Lambda
# This script handles the deployment, working around the SAM CLI
# S3 Transfer Acceleration bug by using aws cloudformation directly.
#
# Usage:
#   cd api
#   chmod +x deploy.sh
#   ./deploy.sh
#
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Docker running
#   - ECR repository created: 385017713886.dkr.ecr.eu-west-1.amazonaws.com/utworld-api

set -e

REGION="eu-west-1"
STACK_NAME="utworld-api"
ECR_REPO="385017713886.dkr.ecr.eu-west-1.amazonaws.com/utworld-api"
IMAGE_TAG="latest"

echo "=== UTWorld API Deployment ==="
echo ""

# Step 1: Build the Docker image
echo "1. Building Docker image..."
docker build -f Dockerfile.lambda -t utworld-api:${IMAGE_TAG} .

# Step 2: Tag for ECR
echo "2. Tagging image for ECR..."
docker tag utworld-api:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}

# Step 3: Login to ECR
echo "3. Logging into ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REPO}

# Step 4: Push to ECR
echo "4. Pushing image to ECR..."
docker push ${ECR_REPO}:${IMAGE_TAG}
echo "   Image pushed: ${ECR_REPO}:${IMAGE_TAG}"

# Step 5: Deploy with CloudFormation directly (bypasses SAM's S3 bug)
echo "5. Deploying CloudFormation stack..."
echo ""
echo "   If this is your first deploy, you'll need to provide parameters."
echo "   For subsequent deploys, the stack will update in-place."
echo ""

# Package the template (convert SAM transform references)
# Use sam build first, then deploy the .aws-sam output with cloudformation
echo "   Running sam build..."
sam build

echo "   Deploying with sam deploy (using explicit image repo)..."
sam deploy \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --image-repository ${ECR_REPO} \
  --capabilities CAPABILITY_IAM \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "S3Bucket=ut-portfolio-website" \
    "CloudfrontDomain=d1q048o59d0tgk.cloudfront.net" \
    "CorsOrigins=[\"https://utworld.netlify.app\",\"https://admin-utworld.netlify.app\"]"

echo ""
echo "=== Deployment complete ==="
echo ""

# Get the API URL
API_URL=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text 2>/dev/null || echo "")

if [ -n "$API_URL" ]; then
  echo "API URL: ${API_URL}"
  echo ""
  echo "Test it: curl ${API_URL}/health"
  echo ""
  echo "Next steps:"
  echo "  1. Set REACT_APP_API_URL in Netlify for frontend:"
  echo "     netlify env:set REACT_APP_API_URL \"${API_URL}/api/v1\" --context production"
  echo "  2. Set REACT_APP_API_URL in Netlify for admin:"
  echo "     netlify env:set REACT_APP_API_URL \"${API_URL}/api/v1\" --context production"
  echo "  3. Seed admin user:"
  echo "     cd api && python -m scripts.seed_admin"
else
  echo "Could not retrieve API URL. Check the stack in the AWS console."
fi
