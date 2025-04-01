import os
from dotenv import load_dotenv
import requests

# Load token
load_dotenv()
token = os.getenv("HF_API_TOKEN")

# Print first few characters of token (for debugging)
print(f"Token starts with: {token[:6]}...")

# Simple test request
API_URL = "https://api-inference.huggingface.co/models/gpt2"
headers = {"Authorization": f"Bearer {token}"}

# Test API
print("Testing API connection...")
response = requests.post(API_URL, 
    headers=headers,
    json={"inputs": "Hello, how are you?"}
)

print(f"Status code: {response.status_code}")
print(f"Response: {response.text[:200]}")