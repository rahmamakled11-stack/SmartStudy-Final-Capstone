import { Request, Response } from 'express';
import ChatHistory from '@/models/ChatHistory';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AIService } from '@/utils/aiService';
import { AppError } from '@/middleware/errorHandler';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message, conversationId } = req.body;

  let chat = conversationId
    ? await ChatHistory.findOne({ _id: conversationId, userId: req.user!.userId })
    : null;

  if (!chat) {
    chat = await ChatHistory.create({
      userId: req.user!.userId,
      title: message.slice(0, 30) + '...',
      messages: [],
    });
  }

  chat.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
  });

  const context = chat.messages.slice(-10).map((m) => `${m.role}: ${m.content}`).join('\n');
  const aiResponse = await AIService.generateChatResponse(message, context);

  chat.messages.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date(),
  });

  chat.updatedAt = new Date();
  await chat.save();

  sendSuccess(res, {
    message: aiResponse,
    conversationId: chat._id,
  }, 'Message sent');
});

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await ChatHistory.find({ userId: req.user!.userId })
    .select('_id title updatedAt createdAt')
    .sort({ updatedAt: -1 });

  sendSuccess(res, conversations, 'Conversations retrieved');
});

export const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const chat = await ChatHistory.findOne({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  if (!chat) throw new AppError('Conversation not found', 404);

  sendSuccess(res, chat, 'Conversation retrieved');
});

export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
  await ChatHistory.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  sendSuccess(res, null, 'Conversation deleted');
});
