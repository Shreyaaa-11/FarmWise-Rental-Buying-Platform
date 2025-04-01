from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv("HF_API_TOKEN")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# Using OpenAssistant model
API_URL = "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5"
headers = {"Authorization": f"Bearer {token}"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # OpenAssistant works well with conversation-style prompts
        prompt = f"""<|prompter|>I need detailed information about farming. Here's my question:
{request.message}

Please provide a comprehensive answer covering:
- Detailed explanations
- Specific examples
- Technical details
- Best practices
- Practical tips
<|assistant|>"""
        
        print(f"Sending request for: {request.message}")
        
        response = requests.post(API_URL, headers=headers, json={
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 500,
                "temperature": 0.7,
                "top_p": 0.95,
                "do_sample": True,
                "return_full_text": False,
                "stop": ["<|prompter|>"]  # Stop at the end of assistant's response
            }
        })
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            if isinstance(response_data, list) and len(response_data) > 0:
                text = response_data[0].get('generated_text', '')
                # Clean up the response
                text = text.replace(prompt, '').strip()
                # Remove any remaining markers
                text = text.replace('<|assistant|>', '').replace('<|prompter|>', '').strip()
                return {"response": text}
            else:
                return {"response": "I couldn't generate a detailed response. Please try asking in a different way."}
        else:
            print(f"API Error: {response.status_code}", response.text)
            return {"response": "Sorry, I'm having trouble generating a response."}
            
    except Exception as e:
        print("ERROR:", str(e))
        return {"response": "I apologize, I'm having trouble. Please try again."}

# Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Farming Assistant API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 