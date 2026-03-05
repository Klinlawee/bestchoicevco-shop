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
      
      // Set multiple cookie variations to ensure at least one works
      const cookieOptions = {
        path: '/',
        maxAge: data.session.expires_in,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
      }
      
      // Set with sb- prefix (what Supabase expects)
      cookieStore.set('sb-plwlcekaqvirxbxlxekn-auth-token', data.session.access_token, cookieOptions)
      cookieStore.set('sb-plwlcekaqvirxbxlxekn-auth-token.0', data.session.access_token, cookieOptions)
      cookieStore.set('sb-plwlcekaqvirxbxlxekn-refresh-token', data.session.refresh_token, cookieOptions)
      
      // Set without prefix (what your screenshot shows)
      cookieStore.set('plwlcekaqvirxbxlxekn-auth-token', data.session.access_token, {
        ...cookieOptions,
        httpOnly: false // Allow JavaScript access
      })
      
      // Set common names
      cookieStore.set('sb-access-token', data.session.access_token, cookieOptions)
      cookieStore.set('sb-refresh-token', data.session.refresh_token, cookieOptions)
      
      console.log('✅ Multiple cookies set')
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
