import { Chat } from './types';

const STORAGE_KEYS = {
  CHATS: 'elite-chat-chats',
  ACTIVE_CHAT_ID: 'elite-chat-active-id',
  SELECTED_MODEL_ID: 'elite-chat-model-id',
} as const;

// Debounced save to avoid excessive localStorage writes
let saveTimeout: NodeJS.Timeout | null = null;

function debouncedSave(key: string, data: any) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, 250);
}

export function saveChats(chats: Chat[]): void {
  debouncedSave(STORAGE_KEYS.CHATS, chats);
}

export function loadChats(): Chat[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveActiveChatId(chatId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, chatId);
}

export function loadActiveChatId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
}

export function saveSelectedModelId(modelId: string): void {
  localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, modelId);
}

export function loadSelectedModelId(): string {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID) || 'tinyllama-1.1b-chat';
}

export function exportChat(chat: Chat): void {
  const dataStr = JSON.stringify(chat, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat-${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function exportAllChats(chats: Chat[]): void {
  const dataStr = JSON.stringify(chats, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `all-chats-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}