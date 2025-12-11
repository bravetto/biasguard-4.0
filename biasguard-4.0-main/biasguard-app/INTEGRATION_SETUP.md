# BiasGuard API Integration Setup

## ✅ Fixed Configuration

### Port Conflict Resolved
- **Changed default port from 3000 to 3001** (to avoid Grafana conflict)
- Server now runs on: **http://localhost:3001**

### Backend API Integration
- **BiasGuard API URL**: http://100.78.184.123:8080
- The API route will try multiple endpoint patterns automatically

## 🔗 Updated UI Links

### Main Pages (Port 3001):
- **Landing Page**: http://localhost:3001
- **Editor Page**: http://localhost:3001/editor ⭐
- **Dashboard**: http://localhost:3001/dashboard

### Alternative Ports:
- Port 3002: `npm run dev:3002` → http://localhost:3002
- Port 5000: `npm run dev:5000` → http://localhost:5000
- Port 8080: `npm run dev:8080` → http://localhost:8080

## 🔧 API Endpoint Configuration

The API route will automatically try these endpoints in order:

1. `http://100.78.184.123:8080/api/analyze`
2. `http://100.78.184.123:8080/analyze`
3. `http://100.78.184.123:8080/BRAVETTO_TEAM_HUB.html/api/analyze`
4. `http://100.78.184.123:8080/BRAVETTO_TEAM_HUB.html/analyze`

If you know the exact endpoint, you can:
1. Check the browser console for which endpoint works
2. Update the API route to use only that endpoint
3. Or create `.env.local` with the specific endpoint

## 📝 Environment Setup

Create a `.env.local` file in `biasguard-app` directory:

```env
BIASGUARD_API_URL=http://100.78.184.123:8080
BIASGUARD_API_KEY=your-api-key-if-needed
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🚀 Running the Server

```bash
cd biasguard-4.0-main\biasguard-app
npm run dev
```

The server will start on **port 3001** (no conflict with Grafana on 3000).

## 🧪 Testing

1. Open: http://localhost:3001/editor
2. Type test text: "All women are naturally bad at math."
3. Check browser console (F12) to see which API endpoint is being used
4. Verify bias detection is working

## 🐛 Troubleshooting

### If API calls fail:
1. Check browser console for errors
2. Verify the BiasGuard API is accessible: http://100.78.184.123:8080
3. Check which endpoint pattern works
4. Update the API route if needed

### If port 3001 is also busy:
```bash
npm run dev:3002  # or 5000, 8080
```

---

**Server is running on port 3001!** 🎉

Open: **http://localhost:3001/editor**

