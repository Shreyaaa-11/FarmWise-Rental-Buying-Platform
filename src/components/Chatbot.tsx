
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help you with farming equipment today?',
    isBot: true,
  },
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "Thank you for your question about our farming equipment.",
        "We have a wide range of tractors and harvesters available for both purchase and rent.",
        "Would you like to know more about our special offers on agricultural machinery?",
        "Our experts are available for consultation on the right equipment for your farm size.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        isBot: true,
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            variant="default" 
            className="rounded-full shadow-lg h-14 w-14"
          >
            <MessageCircle size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 h-[80vh]">
          <Card className="border-none h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">FarmGear Assistant</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-grow overflow-y-auto">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                      message.isBot
                        ? "bg-muted text-muted-foreground"
                        : "ml-auto bg-primary text-primary-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Chatbot;
