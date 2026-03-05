import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Log cookie reading for debugging
          console.log('🔍 Reading cookie:', name)
          const cookies = document.cookie.split('; ')
          const cookie = cookies.find(c => c.startsWith(`${name}=`))
          const value = cookie?.split('=')[1]
          console.log('📦 Cookie value:', value ? 'found' : 'not found')
          return value
        },
        set(name: string, value: string, options: any) {
          console.log('📝 Setting cookie:', name)
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name)
          document.cookie = `${name}=; path=/; max-age=0`
        }
      }
    }
  )
}
