import { MessageCircle, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full gradient-glow flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-3 text-gradient">
        Start a Conversation
      </h2>
      
      <p className="text-muted-foreground max-w-md leading-relaxed">
        Ask me anything! I'm here to help with questions, creative writing, 
        problem-solving, or just having an interesting chat.
      </p>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        <div className="p-3 rounded-lg border bg-card/50 text-sm text-muted-foreground">
          "Explain quantum computing"
        </div>
        <div className="p-3 rounded-lg border bg-card/50 text-sm text-muted-foreground">
          "Write a creative story"
        </div>
      </div>
    </div>
  );
}