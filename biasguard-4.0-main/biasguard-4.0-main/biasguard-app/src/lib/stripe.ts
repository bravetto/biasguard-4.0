import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20.acacia',
  typescript: true,
})

export const STRIPE_PRICE_IDS = {
  free: process.env.STRIPE_PRICE_ID_FREE || 'free',
  pro: process.env.STRIPE_PRICE_ID_PRO || 'price_1Sd3F3L7UMRowhrwrM2r9Fvq', // Pro plan
  enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_1Sd3B8L7UMRowhrwIi622mH8', // Enterprise plan
} as const

