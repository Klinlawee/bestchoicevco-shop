import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('📝 Login attempt for:', email)
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      console.error('❌ Login error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('✅ Login successful for:', data.user?.email)
    
    if (data.session) {
      console.log('✅ Session created, setting cookies...')
      
      const cookieStore = await cookies()
      
      const cookieOptions = {
        path: '/',
        maxAge: data.session.expires_in,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
      }
      
      // Set the cookie in the format Supabase expects
      cookieStore.set('sb-plwlcekaqvirxbxlxekn-auth-token', data.session.access_token, cookieOptions)
      
      console.log('✅ Cookie set successfully')
    }

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
