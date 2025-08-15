import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ComposerProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function Composer({ onSend, isLoading, disabled }: ComposerProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 144); // Max 6 lines
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={disabled}
              className="min-h-[44px] max-h-36 resize-none pr-12 transition-smooth"
              rows={1}
            />
            
            {/* Send button inside textarea */}
            <Button
              onClick={handleSubmit}
              disabled={!message.trim() || isLoading || disabled}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Stop button (disabled for now - future streaming) */}
          <Button
            variant="outline"
            size="sm"
            disabled={true}
            className="h-11 w-11 p-0 opacity-50"
            aria-label="Stop generation (coming soon)"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length} characters</span>
        </div>
      </div>
    </div>
  );
}