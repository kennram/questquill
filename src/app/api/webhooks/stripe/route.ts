import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`🔔 Webhook received: ${event.type}`);

  // 1. Handle Successful Checkout or Payment
  if (event.type === "checkout.session.completed" || event.type === "invoice.payment_succeeded") {
    const data = event.data.object as any;

    // Stripe puts metadata in different places depending on the event
    const userId = data.metadata?.userId || data.subscription_details?.metadata?.userId;

    console.log(`🔍 Searching for userId in metadata:`, {
      event: event.type,
      metadata: data.metadata,
      userId: userId
    });

    if (userId) {
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("username, is_premium")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error(`❌ Error finding profile for user ${userId}:`, fetchError.message);
      } else {
        console.log(`👤 Found profile for ${profile.username}. Current premium status: ${profile.is_premium}`);

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_premium: true })
          .eq("id", userId);

        if (updateError) {
          console.error(`❌ Error updating premium status for user ${userId}:`, updateError.message);
        } else {
          console.log(`✅ Successfully updated ${profile.username} to Premium status!`);
        }
      }
    } else {
      console.warn(`⚠️ No userId found in metadata for event ${event.id}`);
    }
  }

  return NextResponse.json({ received: true });
}
