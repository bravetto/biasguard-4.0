# 🌐 BiasGuard Web App - UI Links & Ports

## 🚀 Server Status

The development server is running! Access the application using the links below.

## 📍 Default Port (3000)

### Main Pages:
- **Landing Page**: http://localhost:3000
- **Editor Page**: http://localhost:3000/editor
- **Dashboard**: http://localhost:3000/dashboard

---

## 🔄 Alternative Ports

If port 3000 is busy, you can run on different ports:

### Port 3001:
```bash
npm run dev:3001
```
- **Landing Page**: http://localhost:3001
- **Editor Page**: http://localhost:3001/editor
- **Dashboard**: http://localhost:3001/dashboard

### Port 3002:
```bash
npm run dev:3002
```
- **Landing Page**: http://localhost:3002
- **Editor Page**: http://localhost:3002/editor
- **Dashboard**: http://localhost:3002/dashboard

### Port 8080:
```bash
npm run dev:8080
```
- **Landing Page**: http://localhost:8080
- **Editor Page**: http://localhost:8080/editor
- **Dashboard**: http://localhost:8080/dashboard

---

## 🎯 Quick Test Links

### Test Gender Bias:
1. Go to: http://localhost:3000/editor
2. Type: "All women are naturally bad at math."
3. Watch for: Yellow highlights, bias score 5-7, "Universal Claims" pattern

### Test Cultural Bias:
1. Go to: http://localhost:3000/editor
2. Type: "People from that country are always late. It's just part of their culture."
3. Watch for: Bias score 4-7, "Cultural Essentialism" pattern

### Test High Severity:
1. Go to: http://localhost:3000/editor
2. Type: "Those people are like animals."
3. Watch for: Red highlights, bias score 9-10, "Dehumanization" pattern

### Test No Bias:
1. Go to: http://localhost:3000/editor
2. Type: "Research indicates that individual performance varies based on multiple factors."
3. Watch for: No highlights, green checkmark, score 0-2

---

## 🛠️ Running Multiple Instances

You can run multiple instances on different ports simultaneously:

**Terminal 1:**
```bash
npm run dev:3000
```

**Terminal 2:**
```bash
npm run dev:3001
```

**Terminal 3:**
```bash
npm run dev:3002
```

This allows you to test different scenarios side-by-side!

---

## 📱 Mobile Testing

To test on mobile devices on the same network:

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Access from mobile:
   - http://YOUR_IP:3000
   - http://YOUR_IP:3001
   - etc.

Example: If your IP is `192.168.1.100`:
- http://192.168.1.100:3000/editor

---

## 🔍 Features to Test

### Editor Page Features:
- ✅ Real-time typing (contentEditable)
- ✅ Bias highlighting (hover for tooltips)
- ✅ Analysis sidebar (slides from right)
- ✅ Bias score gauge (circular progress)
- ✅ Issue cards with suggestions
- ✅ Export/Share buttons
- ✅ Word/character counter

### Landing Page Features:
- ✅ Hero section with CTA
- ✅ Interactive demo
- ✅ Features grid
- ✅ Pricing tiers
- ✅ Responsive navigation

### Dashboard Features:
- ✅ Statistics cards
- ✅ Usage charts
- ✅ Analytics overview

---

## ⚡ Quick Commands

```bash
# Default port (3000)
npm run dev

# Specific ports
npm run dev:3001
npm run dev:3002
npm run dev:8080

# Build for production
npm run build

# Start production server
npm start
```

---

## 🐛 Troubleshooting

### Port Already in Use?
- Use a different port: `npm run dev:3001`
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Server Not Starting?
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Reinstall: `rm -rf node_modules && npm install`

### API Errors?
- Check that BiasGuard analyzer is accessible
- Verify path in `src/app/api/analyze/route.ts`
- Check console for error messages

---

## 📊 Current Server Status

✅ **Default**: http://localhost:3000 (if running)

To start on a different port, run:
```bash
npm run dev:3001  # or 3002, 8080, etc.
```

---

**Happy Testing! 🚀**

All links are ready to use once the server is running!

