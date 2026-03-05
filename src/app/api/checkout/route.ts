import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const { priceId, planName } = await req.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 1. We should ideally look for a Stripe Customer ID in our profiles table.
    // For simplicity, we'll search by email or let Stripe create a new one.
    // However, searching by email is safer to prevent duplicate customers.
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    // 2. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : user.email, // Stripe error if both customer and email
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${siteUrl}/dashboard?success=true`,
      cancel_url: `${siteUrl}/dashboard/upgrade?canceled=true`,
      metadata: {
        userId: user.id,
        planName: planName,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
