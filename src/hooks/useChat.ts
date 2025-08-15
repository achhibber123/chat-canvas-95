import { useState, useCallback, useEffect } from 'react';
import { Chat, Message, Model } from '@/lib/types';
import { postAnswer, getHealth, ApiError } from '@/lib/api';
import { 
  saveChats, 
  loadChats, 
  saveActiveChatId, 
  loadActiveChatId,
  saveSelectedModelId,
  loadSelectedModelId 
} from '@/lib/storage';
import { generateId, createChatTitle } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_MODELS: Model[] = [
  {
    id: 'tinyllama-1.1b-chat',
    label: 'TinyLlama 1.1B Chat',
    description: 'Fast and efficient chat model'
  }
];

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('tinyllama-1.1b-chat');
  const [isLoading, setIsLoading] = useState(false);
  const [healthInfo, setHealthInfo] = useState<{ device: string; modelPath: string } | null>(null);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const savedChats = loadChats();
    const savedActiveChatId = loadActiveChatId();
    const savedModelId = loadSelectedModelId();

    setChats(savedChats);
    setSelectedModelId(savedModelId);

    if (savedActiveChatId && savedChats.find(c => c.id === savedActiveChatId)) {
      setActiveChatId(savedActiveChatId);
    } else if (savedChats.length > 0) {
      setActiveChatId(savedChats[0].id);
    }

    // Load health info
    getHealth()
      .then(health => {
        setHealthInfo({
          device: health.status,
          modelPath: health.model_path
        });
      })
      .catch(() => {
        // Silently fail for health check
      });
  }, []);

  // Auto-save when chats change
  useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats);
    }
  }, [chats]);

  // Auto-save active chat ID
  useEffect(() => {
    if (activeChatId) {
      saveActiveChatId(activeChatId);
    }
  }, [activeChatId]);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const createNewChat = useCallback((modelId?: string) => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      modelId: modelId || selectedModelId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    
    return newChat;
  }, [selectedModelId]);

  const updateChatTitle = useCallback((chatId: string, title: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title, updatedAt: Date.now() }
        : chat
    ));
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      
      // If we deleted the active chat, switch to another
      if (chatId === activeChatId) {
        const newActiveId = updated.length > 0 ? updated[0].id : null;
        setActiveChatId(newActiveId);
      }
      
      return updated;
    });
  }, [activeChatId]);

  const switchModel = useCallback((modelId: string) => {
    if (modelId === selectedModelId) return;

    setSelectedModelId(modelId);
    saveSelectedModelId(modelId);

    // If current chat has messages, suggest starting new chat
    if (activeChat && activeChat.messages.length > 0) {
      toast({
        title: `Switched to ${DEFAULT_MODELS.find(m => m.id === modelId)?.label}`,
        description: "Starting a new chat with the selected model.",
      });
      createNewChat(modelId);
    } else if (activeChat) {
      // Update empty chat's model
      setChats(prev => prev.map(chat =>
        chat.id === activeChat.id
          ? { ...chat, modelId, updatedAt: Date.now() }
          : chat
      ));
    }
  }, [selectedModelId, activeChat, createNewChat, toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    let currentChat = activeChat;
    
    // Create new chat if none exists
    if (!currentChat) {
      currentChat = createNewChat();
    }

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    // Update chat title from first message
    if (currentChat.messages.length === 0) {
      const title = createChatTitle(content);
      updateChatTitle(currentChat.id, title);
    }

    // Add user message immediately
    setChats(prev => prev.map(chat =>
      chat.id === currentChat!.id
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            updatedAt: Date.now()
          }
        : chat
    ));

    setIsLoading(true);

    try {
      const response = await postAnswer({
        question: content.trim()
      });

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
        metadata: {
          elapsedSec: response.elapsed_sec,
          device: response.device
        }
      };

      // Add assistant message
      setChats(prev => prev.map(chat =>
        chat.id === currentChat!.id
          ? {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              updatedAt: Date.now()
            }
          : chat
      ));

    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `API Error (${error.status}): ${error.message}`
        : 'Failed to send message. Please try again.';

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Add error message to chat
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Error: ${errorMessage}`,
        timestamp: Date.now()
      };

      setChats(prev => prev.map(chat =>
        chat.id === currentChat!.id
          ? {
              ...chat,
              messages: [...chat.messages, errorMsg],
              updatedAt: Date.now()
            }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  }, [activeChat, createNewChat, updateChatTitle, isLoading, toast]);

  const retryLastMessage = useCallback(() => {
    if (!activeChat || activeChat.messages.length === 0) return;

    const lastUserMessage = [...activeChat.messages]
      .reverse()
      .find(msg => msg.role === 'user');

    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  }, [activeChat, sendMessage]);

  const clearChat = useCallback(() => {
    if (!activeChat) return;

    setChats(prev => prev.map(chat =>
      chat.id === activeChat.id
        ? {
            ...chat,
            messages: [],
            title: 'New Chat',
            updatedAt: Date.now()
          }
        : chat
    ));
  }, [activeChat]);

  return {
    chats,
    activeChat,
    activeChatId,
    selectedModelId,
    isLoading,
    healthInfo,
    models: DEFAULT_MODELS,
    setActiveChatId,
    createNewChat,
    updateChatTitle,
    deleteChat,
    switchModel,
    sendMessage,
    retryLastMessage,
    clearChat
  };
}