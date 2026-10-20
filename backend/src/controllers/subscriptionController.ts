import { Request, Response } from 'express';
import Stripe from 'stripe';
import config from '@/config/env';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AppError } from '@/middleware/errorHandler';

const stripe = new Stripe(config.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' as any });

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
  const { plan, billingPeriod } = req.body;
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const priceMap: Record<string, string> = {
    pro_monthly: config.STRIPE_PRICE_PRO_MONTHLY || '',
    pro_yearly: config.STRIPE_PRICE_PRO_YEARLY || '',
    student_monthly: config.STRIPE_PRICE_STUDENT_MONTHLY || '',
  };

  const priceId = priceMap[`${plan}_${billingPeriod}`];
  if (!priceId) throw new AppError('Invalid plan or billing period', 400);

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${config.CLIENT_URL}/settings?success=true`,
    cancel_url: `${config.CLIENT_URL}/pricing?canceled=true`,
    metadata: { userId: user._id.toString(), plan },
  });

  sendSuccess(res, { url: session.url }, 'Checkout session created');
});

export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const subscription = await Subscription.findOne({ userId: req.user!.userId });

  sendSuccess(res, {
    plan: subscription?.plan || 'free',
    status: subscription?.status || 'active',
    currentPeriodEnd: subscription?.currentPeriodEnd,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd,
  }, 'Subscription status retrieved');
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const payload = req.body as Buffer;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, config.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await Subscription.findOneAndUpdate(
          { userId },
          {
            plan,
            status: 'active',
            stripeSubscriptionId: session.subscription as string,
            currentPeriodStart: new Date(),
          },
          { upsert: true }
        );

        await User.findByIdAndUpdate(userId, {
          subscriptionPlan: plan,
          subscriptionStatus: 'active',
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (user) {
        await Subscription.findOneAndUpdate(
          { userId: user._id },
          { status: 'past_due' }
        );
        await User.findByIdAndUpdate(user._id, { subscriptionStatus: 'past_due' });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await User.findOne({ stripeCustomerId: subscription.customer as string });

      if (user) {
        await Subscription.findOneAndUpdate(
          { userId: user._id },
          { status: 'cancelled', plan: 'free' }
        );
        await User.findByIdAndUpdate(user._id, {
          subscriptionPlan: 'free',
          subscriptionStatus: 'active',
        });
      }
      break;
    }
  }

  sendSuccess(res, null, 'Webhook processed');
});
