import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Sparkles, X } from 'lucide-react';
import CosmicButton from './CosmicButton';

const CosmicAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello, cosmic guardian! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would connect to speech recognition API
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I've analyzed the user engagement patterns. There's a 15% increase in meditation sessions this week!",
        "The library has received 24 new sacred texts. Would you like me to categorize them?",
        "System health is optimal. All energy channels are flowing smoothly.",
        "I've identified the top 10 most active users. Shall I display their profiles?",
        "The cosmic alignment is favorable for introducing new sadhana practices today.",
        "Karma analytics show a positive trend. Users are accumulating good karma at an accelerated rate."
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAssistant}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Sparkles className="h-6 w-6 text-white" />
      </motion.button>

      {/* AI Assistant Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 h-96 cosmic-card z-50 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="cosmic-card-glow"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                <h3 className="font-semibold">Cosmic AI Assistant</h3>
              </div>
              <button
                onClick={toggleAssistant}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-purple-500/20 text-foreground'
                        : 'bg-background/60 text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex items-center">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-full mr-2 ${
                    isListening
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-background/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="w-full bg-background/60 border border-purple-500/30 rounded-lg py-2 px-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={1}
                  />
                </div>
                <CosmicButton
                  onClick={handleSend}
                  variant="primary"
                  size="sm"
                  className="ml-2"
                  disabled={inputText.trim() === ''}
                >
                  <Send className="h-4 w-4" />
                </CosmicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CosmicAIAssistant;