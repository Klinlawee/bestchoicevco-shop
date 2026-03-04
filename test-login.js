// Run this in browser console after login attempt
(async () => {
  const supabase = window.__supabase // This won't work directly, but shows the idea
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Current session:', session)
})()
