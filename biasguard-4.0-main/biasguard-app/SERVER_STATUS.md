# Server Status & Troubleshooting

## Server is Running on Port 3001

If you see "ERR_CONNECTION_REFUSED", the server might still be compiling.

## Quick Fixes

### 1. Wait for Compilation
Next.js needs 15-30 seconds to compile on first run. Look for:
- "Ready" message in terminal
- "compiled successfully" message

### 2. Check Server Terminal
Look at the terminal where you ran `npm run dev`. You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3001
- Ready in Xs
```

### 3. Try Different Port
If port 3001 is blocked, try:
```powershell
npm run dev:3000
# or
npm run dev:5000
```

### 4. Restart Server
```powershell
# Stop server (Ctrl+C)
# Clear cache
Remove-Item -Recurse -Force .next
# Restart
npm run dev
```

## Test URLs

Once server is ready:
- **Editor**: http://localhost:3001/editor
- **Home**: http://localhost:3001

## Verify Server is Working

Open browser console (F12) and check:
- No network errors
- API calls to `/api/analyze` return 200 status

## Common Issues

**Port already in use:**
- Kill process: `netstat -ano | findstr :3001` then `taskkill /PID <PID> /F`
- Or use different port: `npm run dev:5000`

**Server crashes:**
- Check for error messages in terminal
- Verify analyzer path is correct
- Check `src/app/api/analyze/route.ts` for errors

