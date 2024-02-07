import "dotenv/config";
import Stripe from "stripe";

export const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const stripe = new Stripe(process.env.STRIPE_API_SECRET!, {
  typescript: true,
  apiVersion: "2023-10-16",
});
