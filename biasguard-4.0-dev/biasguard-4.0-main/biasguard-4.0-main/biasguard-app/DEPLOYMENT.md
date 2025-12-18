# BiasGuard 4.0 - Vercel Production Deployment

**Deployed:** December 17, 2025  
**Status:** ✅ Live and Operational

---

## 🌐 Production URLs

| Resource | URL |
|----------|-----|
| **Production App** | https://biasguard.vercel.app |
| **API Endpoint** | https://biasguard.vercel.app/api/analyze |
| **Vercel Dashboard** | https://vercel.com/phani-4510s-projects/biasguard |

---

## ✅ Deployment Verification

### API Tests Passed
```
Test 1: Gender Bias Detection
Input: "Men are naturally better leaders than women."
Result: Score 6.5/10 - Level: moderate ✅

Test 2: Neutral Statement
Input: "The weather is nice today."
Result: Score 0/10 - Level: none ✅

Test 3: Racial Bias Detection
Input: "Asian students are always good at math."
Result: Score 5.1/10 - Level: moderate ✅
```

---

## 🔧 Configuration

### Environment Variables (Set in Vercel Dashboard)

Navigate to: **Project Settings → Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | https://biasguard.vercel.app | ✅ |
| `STRIPE_SECRET_KEY` | Stripe live secret key | For payments |
| `STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key | For payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | For payments |
| `STRIPE_PRICE_ID_PRO` | Pro plan price ID | For payments |
| `STRIPE_PRICE_ID_ENTERPRISE` | Enterprise plan price ID | For payments |

---

## 🌍 Custom Domain Setup (biasguard.com)

### Step 1: Add Domain in Vercel
1. Go to https://vercel.com/phani-4510s-projects/biasguard/settings/domains
2. Click "Add Domain"
3. Enter: `biasguard.com`
4. Click "Add"

### Step 2: Configure DNS Records
Add these DNS records at your domain registrar:

**For Apex Domain (biasguard.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate
- Vercel automatically provisions SSL certificates
- Wait 24-48 hours for DNS propagation
- SSL will be active once DNS is verified

---

## 📱 Chrome Extension Setup

### Production Configuration
The extension is configured to use:
```javascript
static API_BASE = 'https://biasguard.vercel.app/api'
```

### Install Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `biasguard-extension/` folder

### Publish to Chrome Web Store
1. Create ZIP of extension folder
2. Go to https://chrome.google.com/webstore/devconsole
3. Upload extension
4. Fill in listing details
5. Submit for review

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitors Core Web Vitals
- Real-time performance metrics

### Error Logging
- View logs: `vercel logs biasguard`
- Real-time: `vercel logs biasguard --follow`

### Recommended Additions
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Uptime Robot** - Uptime monitoring

---

## 🔄 Redeployment

### Auto-Deploy (Recommended)
Connect Git repository:
```bash
vercel git connect
```

### Manual Deploy
```bash
cd biasguard-app
vercel --prod
```

### Rollback
```bash
vercel rollback
```

---

## 🛡️ Security Checklist

- [x] HTTPS enabled (automatic)
- [x] Security headers configured
- [x] API rate limiting (implement if needed)
- [x] CORS properly configured
- [ ] Add rate limiting middleware
- [ ] Set up DDoS protection (Vercel Pro)
- [ ] Configure WAF rules (Vercel Enterprise)

---

## 📈 Performance

### Build Output
```
Route (app)                   Size      First Load JS
┌ ○ /                         7.3 kB    136 kB
├ ○ /dashboard                2.26 kB   98.5 kB
├ ○ /editor                   9.87 kB   144 kB
└ ○ /pricing                  2.95 kB   123 kB
```

### Optimizations Applied
- [x] SWC Minification
- [x] Image optimization
- [x] Static page generation
- [x] Server-side rendering for API routes
- [x] Compression enabled

---

## 🆘 Support

- **Vercel Status:** https://vercel-status.com
- **Documentation:** https://vercel.com/docs
- **Support:** support@vercel.com

---

*Deployment by phani@bravetto.com*  
*Project: phani-4510s-projects/biasguard*

