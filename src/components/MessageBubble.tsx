import { useState } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';
import { Message } from '@/lib/types';
import { formatTimestamp, formatElapsedTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
  onRetry?: () => void;
}

export function MessageBubble({ message, isLast, onRetry }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        description: "Message copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const isUser = message.role === 'user';
  const isError = message.content.startsWith('Error:');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`
        max-w-[80%] min-w-[100px] rounded-xl px-4 py-3 relative
        ${isUser 
          ? 'chat-user-bubble ml-12' 
          : isError 
            ? 'bg-destructive/10 border border-destructive/20 text-destructive mr-12'
            : 'chat-assistant-bubble mr-12'
        }
        transition-smooth
      `}>
        {/* Message content */}
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap break-words m-0 leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Metadata */}
        <div className={`
          flex items-center justify-between mt-2 pt-2 text-xs opacity-70
          ${isUser ? 'border-t border-white/20' : 'border-t border-border/50'}
        `}>
          <span>
            {formatTimestamp(message.timestamp)}
          </span>
          
          {message.metadata?.elapsedSec && (
            <span>
              {formatElapsedTime(message.metadata.elapsedSec)} • {message.metadata.device}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className={`
          absolute -top-2 ${isUser ? '-left-12' : '-right-12'}
          opacity-0 group-hover:opacity-100 transition-smooth
          flex gap-1
        `}>
          {!isUser && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 shadow-md"
              onClick={copyToClipboard}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {isUser && isLast && onRetry && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 shadow-md"
              onClick={onRetry}
              aria-label="Retry message"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}