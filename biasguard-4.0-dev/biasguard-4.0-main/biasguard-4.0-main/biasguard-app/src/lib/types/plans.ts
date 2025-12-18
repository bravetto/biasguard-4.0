export type PlanType = 'free' | 'pro' | 'enterprise'

export interface UserPlan {
  userId: string
  plan: PlanType
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  checksUsed: number
  checksLimit: number
  periodStart: Date
  periodEnd: Date
  createdAt: Date
  updatedAt: Date
}

export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 100,
  pro: 5000,
  enterprise: Infinity
} as const

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  pro: 19,
  enterprise: 99
} as const

export const PLAN_FEATURES: Record<PlanType, string[]> = {
  free: [
    '100 bias checks per month',
    'Basic bias detection',
    'Email support'
  ],
  pro: [
    '5,000 bias checks per month',
    'Advanced bias detection',
    'Priority support',
    'Export analysis reports',
    'API access'
  ],
  enterprise: [
    'Unlimited bias checks',
    'Advanced bias detection',
    'Dedicated support',
    'Custom integrations',
    'SLA guarantee',
    'Team management'
  ]
}

export interface PlanInfo {
  id: PlanType
  name: string
  price: number
  priceId?: string
  features: string[]
  limit: number
  popular?: boolean
}

export const PLANS: PlanInfo[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: PLAN_FEATURES.free,
    limit: PLAN_LIMITS.free
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    features: PLAN_FEATURES.pro,
    limit: PLAN_LIMITS.pro,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: PLAN_FEATURES.enterprise,
    limit: PLAN_LIMITS.enterprise
  }
]

