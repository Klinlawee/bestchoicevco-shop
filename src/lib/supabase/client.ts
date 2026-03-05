import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          console.log('🔍 Looking for cookie:', name)
          
          // Log all cookies for debugging
          const allCookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=')
            acc[key] = value
            return acc
          }, {} as Record<string, string>)
          
          console.log('📦 All cookies:', Object.keys(allCookies))
          
          // Try multiple patterns
          const patterns = [
            name, // Original name
            `sb-${name}`, // With sb- prefix
            name.replace('sb-', ''), // Without sb- prefix
            `sb-${name.split('-').pop()}`, // Short version
            'sb-access-token', // Common name
            'sb-refresh-token' // Common name
          ]
          
          console.log('🔍 Trying patterns:', patterns)
          
          for (const pattern of patterns) {
            const cookie = document.cookie.split('; ').find(c => c.startsWith(`${pattern}=`))
            if (cookie) {
              const value = cookie.split('=')[1]
              console.log('✅ Found cookie with pattern:', pattern)
              return value
            }
          }
          
          console.log('❌ No cookie found for:', name)
          return null
        },
        set(name: string, value: string, options: any) {
          console.log('📝 Setting cookie:', name)
          
          // Set both prefixed and unprefixed versions
          const baseOptions = `path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
          
          // Set original name
          document.cookie = `${name}=${value}; ${baseOptions}`
          
          // Set with sb- prefix if not already present
          if (!name.startsWith('sb-')) {
            document.cookie = `sb-${name}=${value}; ${baseOptions}`
          }
          
          // Also set common names for compatibility
          if (name.includes('auth-token')) {
            document.cookie = `sb-access-token=${value}; ${baseOptions}`
          }
          if (name.includes('refresh-token')) {
            document.cookie = `sb-refresh-token=${value}; ${baseOptions}`
          }
        },
        remove(name: string, options: any) {
          console.log('🗑️ Removing cookie:', name)
          const baseOptions = `path=/; max-age=0`
          
          document.cookie = `${name}=; ${baseOptions}`
          document.cookie = `sb-${name}=; ${baseOptions}`
          document.cookie = `sb-access-token=; ${baseOptions}`
          document.cookie = `sb-refresh-token=; ${baseOptions}`
        }
      }
    }
  )
}
