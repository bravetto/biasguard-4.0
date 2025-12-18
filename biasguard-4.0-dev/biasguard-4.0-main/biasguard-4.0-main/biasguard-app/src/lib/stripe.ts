import Stripe from 'stripe'

// Stripe is optional - allow deployment without keys
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PRICE_IDS = {
  free: process.env.STRIPE_PRICE_ID_FREE || 'free',
  pro: process.env.STRIPE_PRICE_ID_PRO || 'price_1Sd3F3L7UMRowhrwrM2r9Fvq', // Pro plan
  enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_1Sd3B8L7UMRowhrwIi622mH8', // Enterprise plan
} as const

