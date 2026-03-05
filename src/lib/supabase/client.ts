import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // The cookie name we're looking for
          console.log('🔍 Looking for cookie:', name)
          
          // Get all cookies
          const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=')
            if (key) acc[key] = value
            return acc
          }, {} as Record<string, string>)
          
          console.log('📦 All cookies:', Object.keys(cookies))
          
          // Check for exact match first
          if (cookies[name]) {
            console.log('✅ Found exact match:', name)
            return cookies[name]
          }
          
          // Check for cookie without sb- prefix
          const withoutPrefix = name.replace('sb-', '')
          if (cookies[withoutPrefix]) {
            console.log('✅ Found cookie without sb- prefix:', withoutPrefix)
            return cookies[withoutPrefix]
          }
          
          // Check for cookie with sb- prefix
          const withPrefix = `sb-${withoutPrefix}`
          if (cookies[withPrefix]) {
            console.log('✅ Found cookie with sb- prefix:', withPrefix)
            return cookies[withPrefix]
          }
          
          // Check for common names
          if (cookies['sb-access-token']) {
            console.log('✅ Found sb-access-token')
            return cookies['sb-access-token']
          }
          
          console.log('❌ No cookie found for:', name)
          return null
        },
        set(name: string, value: string, options: any) {
          console.log('📝 Setting cookie:', name)
          const cookieStr = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          document.cookie = cookieStr
          
          // Also set without sb- prefix for compatibility
          if (name.startsWith('sb-')) {
            const withoutPrefix = name.replace('sb-', '')
            document.cookie = `${withoutPrefix}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          }
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name)
          document.cookie = `${name}=; path=/; max-age=0`
          document.cookie = `${name.replace('sb-', '')}=; path=/; max-age=0`
        }
      }
    }
  )
}
