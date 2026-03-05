#!/bin/bash

echo "🔍 Running complete project diagnosis..."
echo "========================================"

# Check TypeScript
echo -e "\n📝 TypeScript Check:"
npx tsc --noEmit

# Check linting
echo -e "\n🔎 Linting Check:"
npm run lint

# Check dependencies
echo -e "\n📦 Dependency Audit:"
npm audit --level=high

# Check environment
echo -e "\n🌍 Environment Variables:"
node -e "
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY'
];
required.forEach(key => {
  if (!process.env[key]) console.log('❌', key, 'not set');
  else console.log('✅', key, 'is set');
});
"

# Check for common cookie issues
echo -e "\n🍪 Checking for cookie-related code:"
grep -r "cookie" src/ --include="*.ts" --include="*.tsx"

echo -e "\n✅ Diagnosis complete!"
