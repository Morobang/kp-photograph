import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { first_name, last_name, email, phone, service, shoot_date, shoot_time, location, message } = body

  if (!first_name || !email || !service || !shoot_date || !shoot_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check date not blocked
  const { data: blocked } = await supabaseAdmin()
    .from('blocked_dates')
    .select('id')
    .eq('blocked_date', shoot_date)
    .single()

  if (blocked) {
    return NextResponse.json({ error: 'Date is unavailable' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('bookings')
    .insert({ first_name, last_name, email, phone, service, shoot_date, shoot_time, location, message, status: 'pending' })

  if (error) {
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}