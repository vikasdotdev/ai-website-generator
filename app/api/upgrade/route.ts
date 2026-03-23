// This route has been replaced by the Stripe payment flow.
// See /api/create-checkout-session and /api/webhook instead.
//
// Keeping this file to return a clear message if anyone calls it.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint has been deprecated. Please use the Stripe checkout flow to purchase credits.",
    },
    { status: 410 }
  );
}
