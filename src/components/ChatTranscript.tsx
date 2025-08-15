import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { Chat } from '@/lib/types';

interface ChatTranscriptProps {
  chat?: Chat;
  isLoading: boolean;
  onRetry: () => void;
}

export function ChatTranscript({ chat, isLoading, onRetry }: ChatTranscriptProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        if (isNearBottom || isLoading) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    scrollToBottom();
  }, [chat?.messages, isLoading]);

  if (!chat || chat.messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
    >
      {chat.messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLast={index === chat.messages.length - 1}
          onRetry={message.role === 'user' ? onRetry : undefined}
        />
      ))}
      
      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}