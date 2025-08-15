export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-assistant-bubble max-w-[80%] mr-12 px-4 py-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-muted-foreground">AI is thinking</span>
          <div className="flex space-x-1 ml-2">
            <div className="w-1 h-1 bg-current rounded-full typing-indicator"></div>
            <div className="w-1 h-1 bg-current rounded-full typing-indicator"></div>
            <div className="w-1 h-1 bg-current rounded-full typing-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  );
}