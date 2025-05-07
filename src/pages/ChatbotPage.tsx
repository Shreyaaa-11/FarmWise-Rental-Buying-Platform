import { ChatPopup } from '@/components/ChatPopup';
import React from 'react';
// import AdChatbot from '@/components/AdChatbot'; // Import the AdChatbot component

export default function ChatbotPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Farming Assistant</h1>
        <p className="text-gray-600">
          Ask me anything about farming practices, crops, and agricultural conditions in Karnataka
        </p>
      </div>
       <ChatPopup />
    </div>
  );
} 