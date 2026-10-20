import mongoose, { Schema, Document } from 'mongoose';

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
