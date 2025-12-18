import { NextRequest, NextResponse } from 'next/server'
import { PLAN_LIMITS } from '@/lib/types/plans'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'anonymous'

    // TODO: Get user plan from database
    // For now, return mock data
    const userPlan = {
      userId,
      plan: 'free' as const,
      checksUsed: 0,
      checksLimit: PLAN_LIMITS.free,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }

    const canCheck = userPlan.checksUsed < userPlan.checksLimit
    const remaining = Math.max(0, userPlan.checksLimit - userPlan.checksUsed)

    return NextResponse.json({
      plan: userPlan.plan,
      checksUsed: userPlan.checksUsed,
      checksLimit: userPlan.checksLimit,
      remaining,
      canCheck,
      periodEnd: userPlan.periodEnd.toISOString(),
    })
  } catch (error: any) {
    console.error('Check usage error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check usage' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // TODO: Increment usage in database
    // await incrementUserUsage(userId)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Increment usage error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to increment usage' },
      { status: 500 }
    )
  }
}

