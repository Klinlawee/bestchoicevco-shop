import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          console.log('🔍 Looking for cookie:', name)
          
          // Try multiple patterns
          const patterns = [
            name,
            name.replace('sb-', ''),
            `sb-${name}`,
            'sb-access-token',
            'sb-refresh-token'
          ]
          
          const cookies = document.cookie.split('; ')
          
          for (const pattern of patterns) {
            const cookie = cookies.find(c => c.startsWith(`${pattern}=`))
            if (cookie) {
              console.log('✅ Found cookie with pattern:', pattern)
              return cookie.split('=')[1]
            }
          }
          
          return null
        },
        set(name: string, value: string, options: any) {
          // Don't automatically remove cookies
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
        },
        remove(name: string, options: any) {
          // Only remove if explicitly told to
          console.log('🗑️ Removing cookie:', name)
          document.cookie = `${name}=; path=/; max-age=0`
        }
      }
    }
  )
}
