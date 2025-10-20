
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, MoonStar, User, Loader2 } from 'lucide-react';
import ClaudeApiSetup from '@/components/ClaudeApiSetup';

interface ClaudeChatProps {
  communications: Array<{
    sender: 'user' | 'deity';
    message: string;
    timestamp: string;
  }>;
  deityName: string;
  isLoading: boolean;
  hasApiKey: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  handleSendMessage: () => void;
  messageText: string;
  setMessageText: (text: string) => void;
}

const ClaudeChat = ({
  communications,
  deityName,
  isLoading,
  hasApiKey,
  apiKey,
  setApiKey,
  handleSendMessage,
  messageText,
  setMessageText
}: ClaudeChatProps) => {
  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {hasApiKey ? 
            "Commune with Claude AI, your spiritual guide" : 
            "Set your Claude AI API key to begin your spiritual dialogue"}
        </p>
        <ClaudeApiSetup apiKey={apiKey} setApiKey={setApiKey} />
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-secondary/30 rounded-lg">
        {communications.map((comm, index) => (
          <div 
            key={index} 
            className={`flex ${comm.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                comm.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary border border-purple-500/20'
              }`}
            >
              <div className="flex items-center mb-1">
                {comm.sender === 'user' ? (
                  <User className="h-3 w-3 mr-2" />
                ) : (
                  <MoonStar className="h-3 w-3 mr-2" />
                )}
                <span className="text-xs font-medium">
                  {comm.sender === 'user' ? 'You' : deityName}
                </span>
              </div>
              <p>{comm.message}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary border border-purple-500/20 max-w-[80%] p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <MoonStar className="h-3 w-3 mr-2" />
                <span className="text-xs font-medium">{deityName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Communing with the divine...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Textarea
          placeholder="Ask for divine guidance..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || !hasApiKey}
        />
        <Button 
          className="self-end bg-primary-gradient"
          onClick={handleSendMessage}
          disabled={isLoading || !hasApiKey}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending
            </>
          ) : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ClaudeChat;
