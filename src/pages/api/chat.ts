import { InferenceClient } from "@huggingface/inference";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OpenRouter API key is not configured');
}

export async function handleChat(message: string) {
  if (!message) {
    throw new Error('Message is required');
  }

  try {
    console.log('Sending request to OpenRouter...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FarmWise Crop Chatbot'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You are an expert on farming and agriculture in Karnataka, India. Provide detailed, accurate, and helpful information about farming practices, crops, techniques, and agricultural conditions specific to Karnataka. Format your responses in plain text without any markdown, hashtags, or special characters. Use simple paragraphs and bullet points when needed. If the question is not related to farming in Karnataka, politely redirect the conversation back to farming in Karnataka."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API Response:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from API');
    }

    // Clean up the response text
    const cleanResponse = data.choices[0].message.content
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/`/g, '') // Remove code markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to plain text
      .trim();

    return { response: cleanResponse };
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
} 