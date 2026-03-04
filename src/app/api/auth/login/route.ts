import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      console.error('Login error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Login successful for:', data.user?.email)
    console.log('Session created:', !!data.session)
    
    return NextResponse.json({ 
      success: true,
      user: {
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
