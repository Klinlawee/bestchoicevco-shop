
#!/bin/bash
echo "🔍 Checking for processes on port 3000..."
sudo kill -9 $(sudo lsof -t -i:3000) 2>/dev/null && echo "✅ Killed process on port 3000" || echo "✅ Port 3000 is free"
echo "🚀 Starting development server..."
npm run dev
