import { Activity, Globe } from 'lucide-react';

interface ChatFooterProps {
  apiBase?: string;
  healthInfo?: {
    device: string;
    modelPath: string;
  } | null;
}

export function ChatFooter({ apiBase, healthInfo }: ChatFooterProps) {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>API: {apiBase || 'http://localhost:8000'}</span>
          </div>
          
          {healthInfo && (
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>Device: {healthInfo.device}</span>
            </div>
          )}
        </div>
        
        <div className="text-xs">
          Elite Chat v1.0
        </div>
      </div>
    </footer>
  );
}