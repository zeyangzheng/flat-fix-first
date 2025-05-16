
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import TroubleshootingGuide from './TroubleshootingGuide';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConversationProps {
  conversation: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onBack: () => void;
  selectedCategory?: string;
  showTroubleshootingGuide?: boolean;
}

const AIConversation = ({
  conversation,
  isLoading,
  onSendMessage,
  onBack,
  selectedCategory,
  showTroubleshootingGuide
}: AIConversationProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-muted/30 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="h-10 w-10 mb-2 opacity-50" />
            <p>AI assistant is ready to help you</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((message, index) => (
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
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showTroubleshootingGuide && selectedCategory && (
        <div className="mb-4">
          <TroubleshootingGuide 
            category={selectedCategory || ''}
            pdfUrl={'/guides/' + selectedCategory?.toLowerCase().replace(/\s+/g, '-') + '.pdf' || ''}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your response here..."
          className="resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isLoading}
          className="h-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex justify-between mt-4">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};

export default AIConversation;
