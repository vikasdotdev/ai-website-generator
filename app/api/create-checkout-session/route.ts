import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.primaryEmailAddress.emailAddress;

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "10 AI Credits",
              description: "Add 10 credits to your AI Website Builder account",
            },
            unit_amount: 9900, // ₹99.00 in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/workspace/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/workspace`,
      customer_email: email,
      metadata: {
        userEmail: email,
        creditsToAdd: "10",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/create-checkout-session error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
