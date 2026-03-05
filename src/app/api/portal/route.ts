import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 1. We need to find the Stripe Customer ID
    // For a real production app, you should save the customer_id in your 'profiles' table.
    // For now, we will search Stripe by email.
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No Stripe customer found. Have you subscribed yet?" }, { status: 404 });
    }

    const customerId = customers.data[0].id;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 2. Create a Billing Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/dashboard/profile`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (error: any) {
    console.error("STRIPE PORTAL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
