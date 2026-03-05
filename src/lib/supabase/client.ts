import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          console.log('🔍 Looking for cookie:', name)
          
          const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=')
            if (key) acc[key] = value
            return acc
          }, {} as Record<string, string>)
          
          console.log('📦 Available cookies:', Object.keys(cookies))
          
          // Try to find the cookie
          if (cookies[name]) {
            console.log('✅ Found exact match:', name)
            return cookies[name]
          }
          
          // Try without sb- prefix
          const withoutPrefix = name.replace('sb-', '')
          if (cookies[withoutPrefix]) {
            console.log('✅ Found without prefix:', withoutPrefix)
            return cookies[withoutPrefix]
          }
          
          return null
        },
        set(name: string, value: string, options: any) {
          console.log('📝 Setting cookie:', name)
          // Set both prefixed and unprefixed versions
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          if (name.startsWith('sb-')) {
            const withoutPrefix = name.replace('sb-', '')
            document.cookie = `${withoutPrefix}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          }
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name)
          document.cookie = `${name}=; path=/; max-age=0`
        }
      }
    }
  )
}
