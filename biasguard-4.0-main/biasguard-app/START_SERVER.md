# 🚀 How to Start the Server Properly

## ⚠️ If You Get 404 Errors

The server needs time to compile. Follow these steps:

### Step 1: Stop All Node Processes
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Step 2: Clear Cache
```powershell
cd C:\Users\phani\Downloads\biasguard-4.0-main\biasguard-4.0-main\biasguard-app
Remove-Item -Recurse -Force .next
```

### Step 3: Start Server
```powershell
npm run dev
```

### Step 4: WAIT for This Message
```
✓ Ready in X seconds
○ Local:        http://localhost:3001
```

### Step 5: Open Browser
**Wait 15-20 seconds AFTER seeing "Ready"**, then open:
```
http://localhost:3001/editor
```

---

## 🔍 Check Server Status

Look for these in the terminal:

✅ **Good signs:**
- "Compiling /editor ..."
- "✓ Compiled /editor in Xms"
- "○ Local: http://localhost:3001"

❌ **Bad signs:**
- "Error: ..."
- No "Ready" message
- Port already in use

---

## 🎯 Quick Fix Commands

**Copy and paste this entire block:**

```powershell
cd C:\Users\phani\Downloads\biasguard-4.0-main\biasguard-4.0-main\biasguard-app
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

**Then wait 20 seconds and open:**
```
http://localhost:3001/editor
```

---

## 📝 Expected Terminal Output

When server starts correctly, you should see:

```
▲ Next.js 14.2.33
- Local:        http://localhost:3001
- Ready in X seconds

✓ Compiled / in Xms
✓ Compiled /editor in Xms
```

---

## 🐛 Still Getting 404?

1. **Check the terminal** - Is it showing "Ready"?
2. **Check the port** - Is it 3001?
3. **Wait longer** - First compile takes 20-30 seconds
4. **Try different port**: `npm run dev:5000`
5. **Check browser console** (F12) for errors

---

## ✅ Success Indicators

When it's working, you'll see:
- ✅ Server shows "Ready"
- ✅ Browser loads the editor page
- ✅ No 404 error
- ✅ Editor interface appears

---

**The server is restarting now. Wait 20 seconds, then try:**
```
http://localhost:3001/editor
```

