const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
  const [key, value] = cookie.split('=');
  if (key) acc[key] = value;
  return acc;
}, {});
console.log('Current cookies:', cookies);
EOF# Create a debug script to check cookies
cat > debug-cookies.js << 'EOF'
const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
  const [key, value] = cookie.split('=');
  if (key) acc[key] = value;
  return acc;
}, {});
console.log('Current cookies:', cookies);
