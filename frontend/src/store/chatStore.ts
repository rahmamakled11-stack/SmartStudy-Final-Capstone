import { create } from 'zustand';
import apiClient from '@/lib/api';
import { ChatConversation, ChatMessage } from '@/types';

interface ChatState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  isLoading: boolean;

  fetchConversations: () => Promise<void>;
  createConversation: () => Promise<string>;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id'>) => void;
  generateAIResponse: (conversationId: string, message: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  getCurrentConversation: () => ChatConversation | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,

  fetchConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    set({ conversations: response.data });
  },

  createConversation: async () => {
    const tempId = `temp-${Date.now()}`;
    set({ currentConversationId: tempId });
    return tempId;
  },

  setCurrentConversation: (id) => {
    set({ currentConversationId: id });
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, { ...message, id: `msg-${Date.now()}` }],
          };
        }
        return conv;
      }),
    }));
  },

  generateAIResponse: async (conversationId, message) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/chat/send', {
        message,
        conversationId: conversationId.startsWith('temp-') ? undefined : conversationId,
      });

      const { message: aiMessage, conversationId: newId } = response.data;

      set((state) => {
        const updatedConversations = [...state.conversations];
        const existingIndex = updatedConversations.findIndex((c) => c.id === conversationId);

        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: aiMessage,
          timestamp: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            id: newId || conversationId,
            messages: [...updatedConversations[existingIndex].messages, newMessage],
          };
        } else {
          updatedConversations.push({
            id: newId || conversationId,
            title: message.slice(0, 30) + '...',
            messages: [
              { id: `msg-${Date.now()}-user`, role: 'user', content: message, timestamp: new Date().toISOString() },
              newMessage,
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        return {
          conversations: updatedConversations,
          currentConversationId: newId || conversationId,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteConversation: async (id) => {
    await apiClient.delete(`/chat/conversations/${id}`);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
    }));
  },

  getCurrentConversation: () => {
    return get().conversations.find((c) => c.id === get().currentConversationId);
  },
}));
