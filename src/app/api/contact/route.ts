import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { first_name, last_name, email, service, message } = body

  if (!first_name || !email || !service || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('enquiries')
    .insert({ first_name, last_name, email, service, message, status: 'new' })

  if (error) {
    console.error('Supabase enquiry insert error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}