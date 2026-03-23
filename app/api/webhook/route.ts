import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Webhook: Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userEmail = session.metadata?.userEmail;
      const creditsToAdd = parseInt(session.metadata?.creditsToAdd || "10", 10);

      if (!userEmail) {
        console.error("Webhook: No userEmail in session metadata");
        return NextResponse.json(
          { error: "No user email in metadata" },
          { status: 400 }
        );
      }

      // Only update if payment was actually paid
      if (session.payment_status === "paid") {
        console.log(
          `Webhook: Adding ${creditsToAdd} credits to ${userEmail}`
        );

        await db
          .update(usersTable)
          .set({
            credits: sql`${usersTable.credits} + ${creditsToAdd}`,
          })
          .where(eq(usersTable.email, userEmail));

        console.log(`Webhook: Credits added successfully for ${userEmail}`);
      } else {
        console.log(
          `Webhook: Payment not yet paid for ${userEmail}, status: ${session.payment_status}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("POST /api/webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
