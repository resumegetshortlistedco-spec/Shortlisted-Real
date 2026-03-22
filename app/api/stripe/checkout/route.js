// app/api/stripe/checkout/route.js
//
// Creates a Stripe Checkout session for a given product type.
// The frontend redirects to Stripe's hosted checkout page.
// On success, Stripe redirects back to /success?session_id=...

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map product types to Stripe price IDs from .env.local
const PRICE_MAP = {
  rewrite: process.env.STRIPE_PRICE_REWRITE,   // $5
  scratch: process.env.STRIPE_PRICE_SCRATCH,   // $10
  human:   process.env.STRIPE_PRICE_HUMAN,     // $30
};

export async function POST(request) {
  try {
    const { type, metadata } = await request.json();

    const priceId = PRICE_MAP[type];
    if (!priceId) {
      return Response.json({ error: "Invalid product type" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successPath = type === "human" ? "confirmed" : "rewrite";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${appUrl}/${successPath}?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${appUrl}/?cancelled=true`,
      metadata: metadata || {},
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
