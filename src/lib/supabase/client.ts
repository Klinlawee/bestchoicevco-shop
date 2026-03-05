import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          console.log('🔍 Reading cookie:', name)
          
          // Try multiple cookie name patterns
          const possibleNames = [
            name, // Original name
            name.replace('sb-', ''), // Without sb- prefix
            `sb-${name}`, // With sb- prefix
            name.split('-').pop() || name, // Just the last part
            'sb-access-token',
            'sb-refresh-token'
          ]
          
          console.log('🔍 Trying patterns:', possibleNames)
          
          const cookies = document.cookie.split('; ')
          
          for (const cookieName of possibleNames) {
            const cookie = cookies.find(c => c.startsWith(`${cookieName}=`))
            if (cookie) {
              const value = cookie.split('=')[1]
              console.log('✅ Found cookie:', cookieName)
              return value
            }
          }
          
          console.log('❌ Cookie not found:', name)
          return null
        },
        set(name: string, value: string, options: any) {
          console.log('📝 Setting cookie:', name)
          // Set both with and without sb- prefix to be safe
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          if (!name.startsWith('sb-')) {
            document.cookie = `sb-${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          }
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name)
          document.cookie = `${name}=; path=/; max-age=0`
          document.cookie = `sb-${name}=; path=/; max-age=0`
        }
      }
    }
  )
}
