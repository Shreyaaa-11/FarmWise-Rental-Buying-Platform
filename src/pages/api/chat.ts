import { InferenceClient } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error('Hugging Face API key is not configured');
}

export async function handleChat(message: string) {
  if (!message) {
    throw new Error('Message is required');
  }

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "hf-inference",
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: "You are an expert on farming and agriculture in Karnataka, India. Provide detailed, accurate, and helpful information about farming practices, crops, techniques, and agricultural conditions specific to Karnataka. If the question is not related to farming in Karnataka, politely redirect the conversation back to farming in Karnataka."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.95,
    });

    return { response: chatCompletion.choices[0].message.content };
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
} 