#!/bin/bash
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
echo "${YELLOW}🔍 Checking for existing Next.js processes...${NC}"
pkill -f "next" 2>/dev/null && echo "${GREEN}✅ Killed existing Next.js processes${NC}" || echo "${GREEN}✅ No Next.js processes found${NC}"
for PORT in {3000..3010}; do
  if ! lsof -i:$PORT > /dev/null 2>&1; then
    echo "${GREEN}✅ Port $PORT is free${NC}"
    echo "${YELLOW}🚀 Starting production server on port $PORT...${NC}"
    echo "${YELLOW}📱 Access your site at: http://localhost:$PORT${NC}"
    npm run start -- -p $PORT
    break
  fi
done
