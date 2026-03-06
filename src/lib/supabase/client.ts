import { createBrowserClient } from '@supabase/ssr'

// Simple in-memory cache for the current session token
let cachedToken: { value: string; timestamp: number } | null = null;
const CACHE_TTL = 5000; // 5 seconds

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Return cached token if still valid
          if (cachedToken && Date.now() - cachedToken.timestamp < CACHE_TTL) {
            return cachedToken.value;
          }

          // Clear cache if no longer valid
          cachedToken = null;
          
          const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            if (key) acc[key] = value;
            return acc;
          }, {} as Record<string, string>)
          
          // Check for the token cookies
          if (cookies[name]) {
            cachedToken = { value: cookies[name], timestamp: Date.now() };
            return cookies[name];
          }
          
          const withoutPrefix = name.replace('sb-', '');
          if (cookies[withoutPrefix]) {
            cachedToken = { value: cookies[withoutPrefix], timestamp: Date.now() };
            return cookies[withoutPrefix];
          }
          
          const token0 = `${name}.0`;
          if (cookies[token0]) {
            cachedToken = { value: cookies[token0], timestamp: Date.now() };
            return cookies[token0];
          }
          
          const token1 = `${name}.1`;
          if (cookies[token1]) {
            cachedToken = { value: cookies[token1], timestamp: Date.now() };
            return cookies[token1];
          }
          
          return null;
        },
        set(name: string, value: string, options: any) {
          cachedToken = null; // Invalidate cache on set
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}; samesite=lax; ${options?.secure ? 'secure;' : ''}`
        },
        remove(name: string, options: any) {
          cachedToken = null; // Invalidate cache on remove
          document.cookie = `${name}=; path=/; max-age=0`
        }
      }
    }
  )
}

// Listen for auth changes to invalidate cache
if (typeof window !== 'undefined') {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  supabase.auth.onAuthStateChange(() => {
    cachedToken = null; // Clear cache on any auth state change
  });
}
