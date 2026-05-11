import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { photo_id } = await req.json()
  if (!photo_id) return NextResponse.json({ error: 'Missing photo_id' }, { status: 400 })

  await supabaseAdmin()
    .from('photo_views')
    .insert({ photo_id })

  return NextResponse.json({ success: true })
}