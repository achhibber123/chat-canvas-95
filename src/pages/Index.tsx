import { useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatList } from '@/components/ChatList';
import { ChatTranscript } from '@/components/ChatTranscript';
import { Composer } from '@/components/Composer';
import { ChatFooter } from '@/components/ChatFooter';
import { Button } from '@/components/ui/button';
import { exportChat } from '@/lib/storage';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    chats,
    activeChat,
    activeChatId,
    selectedModelId,
    isLoading,
    healthInfo,
    models,
    setActiveChatId,
    createNewChat,
    updateChatTitle,
    deleteChat,
    switchModel,
    sendMessage,
    retryLastMessage,
    clearChat
  } = useChat();

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const handleExportActiveChat = () => {
    if (activeChat) {
      exportChat(activeChat);
    }
  };

  return (
    <div className="h-screen flex bg-chat-bg">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
        fixed lg:relative z-30 h-full
      `}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          onRenameChat={updateChatTitle}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="gap-2"
          >
            <PanelLeft className="h-4 w-4" />
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </Button>
        </div>

        {/* Header */}
        <ChatHeader
          selectedModel={selectedModel}
          models={models}
          onModelChange={switchModel}
          onClearChat={clearChat}
          onExportChat={handleExportActiveChat}
          disabled={isLoading}
        />

        {/* Chat transcript */}
        <ChatTranscript
          chat={activeChat}
          isLoading={isLoading}
          onRetry={retryLastMessage}
        />

        {/* Composer */}
        <Composer
          onSend={sendMessage}
          isLoading={isLoading}
        />

        {/* Footer */}
        <ChatFooter
          apiBase={import.meta.env.VITE_API_BASE}
          healthInfo={healthInfo}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
