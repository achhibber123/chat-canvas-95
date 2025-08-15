export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    elapsedSec?: number;
    device?: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  modelId: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface Model {
  id: string;
  label: string;
  description?: string;
}

export interface ApiResponse {
  answer: string;
  elapsed_sec: number;
  device: string;
}

export interface ApiRequest {
  question: string;
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  repetition_penalty?: number;
}

export interface HealthResponse {
  status: string;
  model_path: string;
}