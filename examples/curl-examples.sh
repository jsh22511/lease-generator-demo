#!/bin/bash

# Free Lease Generator API Examples
# Replace BASE_URL with your deployed URL or localhost:3000 for development

BASE_URL="https://your-domain.com"
# BASE_URL="http://localhost:3000"  # For local development

echo "=== Free Lease Generator API Examples ==="
echo "Base URL: $BASE_URL"
echo ""

# Health Check
echo "1. Health Check"
echo "GET $BASE_URL/api/health"
curl -X GET "$BASE_URL/api/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Generate Lease (Sample Request)
echo "2. Generate Lease (Sample Request)"
echo "POST $BASE_URL/api/generate-lease"
curl -X POST "$BASE_URL/api/generate-lease" \
  -H "Content-Type: application/json" \
  -d @sample-request.json \
  --output lease-document.docx \
  -w "\nStatus: %{http_code}\n\n"

# Lead Capture
echo "3. Lead Capture"
echo "POST $BASE_URL/api/lead"
curl -X POST "$BASE_URL/api/lead" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "consent": true,
    "context": "lease_generator"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Rate Limit Test (Multiple Requests)
echo "4. Rate Limit Test (5 rapid requests)"
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST "$BASE_URL/api/generate-lease" \
    -H "Content-Type: application/json" \
    -d @sample-request.json \
    -w "Status: %{http_code}\n" \
    -s -o /dev/null
  sleep 0.5
done

echo ""
echo "=== Examples Complete ==="
