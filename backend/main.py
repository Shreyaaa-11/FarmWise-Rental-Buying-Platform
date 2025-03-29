from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model and tokenizer
model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        print("1. Request received:", request.message)
        
        prompt = f"""You are a helpful farming assistant. Please provide short, concise responses.
        
        User: {request.message}
        Assistant:"""
        print("2. Prompt created:", prompt)
        
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        print("3. Inputs tokenized")
        
        # Fixed parameters to be consistent
        outputs = model.generate(
            **inputs,
            max_length=100,
            num_return_sequences=1,
            do_sample=True,  # Changed to True to work with temperature and top_p
            temperature=0.6,
            top_p=0.9
        )
        print("4. Model generated output")
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("Assistant:")[-1].strip()
        print("5. Final response:", response)
        
        return {"response": response}
    except Exception as e:
        print("ERROR:", e)
        return {"response": "I apologize, I'm having trouble. Please try again."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 