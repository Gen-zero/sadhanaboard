
import { useState } from 'react';
import { sendMessageToClaude, ClaudeMessage } from '@/services/claudeAIService';
import { useToast } from "@/hooks/use-toast";

interface Message {
  sender: 'user' | 'deity';
  message: string;
  timestamp: string;
}

export const useClaudeAI = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem('claude_api_key') || ''
  );
  const { toast } = useToast();

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('claude_api_key', key);
    toast({
      title: "API Key Saved",
      description: "Your Claude AI API key has been saved securely."
    });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      sender: 'user' as const,
      message: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format messages for Claude API with explicit typing to satisfy TypeScript
      const formattedMessages: ClaudeMessage[] = messages
        .concat(userMessage)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.message
        }));

      // Send to Claude AI
      const response = await sendMessageToClaude(formattedMessages, apiKey);
      
      // Add Claude's response
      const claudeMessage = {
        sender: 'deity' as const,
        message: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, claudeMessage]);
    } catch (error) {
      toast({
        title: "Communication Error",
        description: error instanceof Error ? error.message : "Failed to communicate with Claude AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    apiKey,
    setApiKey: saveApiKey,
    hasApiKey: !!apiKey
  };
};
