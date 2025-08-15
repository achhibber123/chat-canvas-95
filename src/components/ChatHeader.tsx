import { Download, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Model } from '@/lib/types';

interface ChatHeaderProps {
  selectedModel: Model;
  models: Model[];
  onModelChange: (modelId: string) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  disabled?: boolean;
}

export function ChatHeader({ 
  selectedModel, 
  models, 
  onModelChange, 
  onClearChat, 
  onExportChat,
  disabled 
}: ChatHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* App name and model selector */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gradient">
            Rishika Chat
          </h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={disabled}
              >
                <span className="text-sm">{selectedModel.label}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`flex flex-col items-start gap-1 ${
                    model.id === selectedModel.id ? 'bg-accent' : ''
                  }`}
                >
                  <span className="font-medium">{model.label}</span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            disabled={disabled}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Chat
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportChat}
            disabled={disabled}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}