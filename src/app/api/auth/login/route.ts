import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('📝 Login attempt for:', email)
    
    if (!email || !password) {
      console.log('❌ Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    console.log('✅ Supabase client created')
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      console.error('❌ Supabase login error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('✅ Login successful for:', data.user?.email)
    console.log('✅ Session created:', !!data.session)
    
    if (data.session) {
      console.log('📦 Session data:', {
        access_token: data.session.access_token.substring(0, 20) + '...',
        expires_in: data.session.expires_in,
        refresh_token: data.session.refresh_token.substring(0, 20) + '...'
      })
    }

    // Return success with user data
    return NextResponse.json({ 
      success: true,
      user: {
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name
      }
    }, { status: 200 })
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
