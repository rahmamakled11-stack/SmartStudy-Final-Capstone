import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'enterprise' | 'student';
  status: 'active' | 'past_due' | 'cancelled';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise', 'student'], default: 'free' },
    status: { type: String, enum: ['active', 'past_due', 'cancelled'], default: 'active' },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
