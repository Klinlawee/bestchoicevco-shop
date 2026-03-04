import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    if (!email || !password || !name) {
      console.log('❌ Missing fields:', { name, email, password })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('📝 Creating user:', email)
    
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name 
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
      },
    })

    if (error) {
      console.error('❌ Supabase signup error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('✅ User created successfully:', data.user?.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Please check your email to confirm your account.' 
    }, { status: 200 })
  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
