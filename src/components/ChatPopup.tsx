import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Loader2, RefreshCw, Maximize2, Minimize2, Bot } from 'lucide-react';
import { handleChat } from '@/pages/api/chat';
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your farming assistant for Karnataka. I can help you with information about farming practices, crops, techniques, and agricultural conditions in Karnataka. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your farming assistant for Karnataka. I can help you with information about farming practices, crops, techniques, and agricultural conditions in Karnataka. What would you like to know?'
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message:', input.trim());
      const data = await handleChat(input.trim());
      console.log('Received response:', data);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Error: ${error.message}`
          : "Failed to get response from the AI assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullScreen(false);
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-x-0 top-16 bottom-0 z-40' : 'fixed bottom-8 right-4 z-50'}`}>
      {!isOpen ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 relative group"
                variant="default"
              >
                <Bot className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-background">
              <p className="font-medium">AI Farming Assistant</p>
              <p className="text-sm text-muted-foreground">Ask me anything about farming</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Card className={`${isFullScreen ? 'h-[calc(100vh-4rem)] w-full rounded-none' : 'w-96 h-[500px]'} flex flex-col shadow-xl`}>
          <div className="p-4 border-b flex justify-between items-center bg-background">
            <h3 className="font-semibold">Farming Assistant</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={resetChat}
                title="Reset chat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className={`space-y-4 ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
            <div className={`flex gap-2 ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming in Karnataka..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
} 