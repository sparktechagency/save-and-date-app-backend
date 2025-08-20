import Stripe from 'stripe';
import stripe from '../config/stripe';
import { User } from '../app/modules/user/user.model';
import { Subscription } from '../app/modules/subscription/subscription.model';
import { Plan } from '../app/modules/plan/plan.model';


// Helper function to create new subscription in database
const createNewSubscription = async (payload: any) => {
    const isExistSubscription = await Subscription.findOne({ user: payload.vendor });
    if (isExistSubscription) {
        await Subscription.findByIdAndUpdate(
            { _id: isExistSubscription._id },
            payload,
            { new: true }
        )
    } else {
        await Subscription.create(payload);
    }
};

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
    try {

        console.log('Subscription Webhook Calling...');
        
        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(data.id as string);
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        const productId = subscription.items.data[0]?.price?.product as string;
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string) as Stripe.Invoice;

        const trxId = (invoice as any)?.payment_intent as string;
        const amountPaid = (invoice?.total || 0) / 100;

        // Find user and pricing plan
        const user = await User.findOne({ email: customer.email }) as any;
        if (!user) {
            console.log('User not found:', customer.email);
            return;
        }

        const plan = await Plan.findOne({ productId }) as any;
        if (!plan) {
            console.log('Invalid Plan!');
            return;
        }

        console.log( new Date(subscription.current_period_start * 1000).toISOString());
        console.log( new Date(subscription.current_period_start * 1000).toISOString())

        // Get the current period start and end dates (Unix timestamps)
        const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString(); // Convert to human-readable date
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        const payload = {
            customerId: customer.id,
            price: amountPaid,
            vendor: user._id,
            plan: plan._id,
            trxId,
            subscriptionId: subscription.id,
            status: 'active',
            currentPeriodStart,
            currentPeriodEnd
        }
        // Create new subscription and update user status
        await createNewSubscription(payload);

        await User.findByIdAndUpdate(
            { _id: user._id },
            { subscribe: true },
            { new: true }
        );

    } catch (error) {
        console.log('Error handling subscription created:', error);
        return;
    }
};