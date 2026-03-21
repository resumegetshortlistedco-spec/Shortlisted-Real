// app/api/stripe/webhook/route.js
//
// Stripe sends events here after payment. This is how you reliably
// know a payment succeeded — more trustworthy than the redirect URL.
//
// To test locally:
//   stripe listen --forward-to localhost:3000/api/stripe/webhook
//   (requires Stripe CLI: https://stripe.com/docs/stripe-cli)

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the events you care about
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Payment succeeded:", session.id);
      // TODO: log to your database, send confirmation email, etc.
      // session.metadata contains anything you passed at checkout creation
      break;
    }
    case "payment_intent.payment_failed": {
      console.log("Payment failed:", event.data.object.id);
      break;
    }
    default:
      // Ignore other event types
      break;
  }

  return Response.json({ received: true });
}
