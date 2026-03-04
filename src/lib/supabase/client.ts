import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = document.cookie.split('; ')
          const cookie = cookies.find(c => c.startsWith(`${name}=`))
          return cookie?.split('=')[1]
        },
        set(name: string, value: string, options: any) {
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; path=/; max-age=0`
        }
      }
    }
  )
}
