# BiasGuard 4.0

<div align="center">

**Real-time bias detection and mitigation for inclusive communication**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Detect bias as you type • 7-layer analysis • Neutral rewrites • Chrome extension**

</div>

---

## 🌟 Overview

BiasGuard 4.0 is a comprehensive bias detection and mitigation system that helps you write more inclusive, equitable content. Built with a sophisticated 7-layer semantic analysis engine, it provides real-time feedback, detailed insights, and actionable suggestions to eliminate bias from your writing.

### Key Features

- ⚡ **Real-Time Detection** - Instant bias analysis as you type (800ms debounce)
- 🛡️ **7-Layer Analysis** - Comprehensive bias detection using advanced pattern matching
- 📊 **Detailed Insights** - Understand bias severity, protected classes, and patterns
- ✨ **Neutral Rewrites** - Automatically generate inclusive alternatives
- 🌐 **Chrome Extension** - Works across Gmail, Google Docs, social media, and more
- 💳 **Subscription Plans** - Free, Pro, and Enterprise tiers with Stripe integration
- 🎨 **Modern UI** - Beautiful, Grammarly-style interface built with Next.js 14

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Stripe account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd biasguard-4.0-main/biasguard-4.0-main
   ```

2. **Install dependencies**
   ```bash
   cd biasguard-app
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local in biasguard-app/
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_ENTERPRISE=price_...
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3001
   ```

---

## 📁 Project Structure

```
biasguard-4.0-main/
├── biasguard-app/              # Next.js web application
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   │   ├── api/           # API routes
│   │   │   │   ├── analyze/   # Bias analysis endpoint
│   │   │   │   ├── stripe/    # Payment processing
│   │   │   │   └── user/      # User management
│   │   │   ├── editor/        # Main editor page
│   │   │   ├── dashboard/     # User dashboard
│   │   │   └── pricing/       # Pricing page
│   │   ├── components/        # React components
│   │   │   ├── Analysis/      # Analysis UI components
│   │   │   ├── BiasEditor/    # Text editor components
│   │   │   ├── Guardian/      # Landing page components
│   │   │   └── Layout/        # Layout components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API clients
│   │   └── store/             # State management (Zustand)
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── biasguard-extension/        # Chrome extension
│   ├── manifest.json
│   ├── background/            # Background service worker
│   ├── content/               # Content scripts
│   ├── popup/                 # Extension popup UI
│   ├── lib/                   # Extension utilities
│   └── assets/                # Icons and images
│
└── src/                       # Core analyzer engine
    ├── core/                  # Core detection modules
    │   ├── analyzer.js        # Main orchestrator
    │   ├── biasPatterns.js    # Pattern definitions
    │   ├── biasTypes.js       # Bias type taxonomy
    │   ├── protectedClasses.js # Protected class mappings
    │   └── causalMap.js       # Causal inference patterns
    ├── implicit/              # Implicit bias detection
    │   ├── implicitResolver.js
    │   └── groupGeneralizationDetector.js
    ├── severity/              # Severity calculation
    │   ├── severityEngine.js
    │   └── qualifierDampening.js
    └── rewrite/               # Text rewriting
        ├── rewriteEngine.js
        ├── neutralityTemplates.js
        └── coherenceCheck.js
```

---

## 🔬 7-Layer Analysis Architecture

BiasGuard uses a sophisticated multi-layer approach to detect and analyze bias:

1. **Protected-Class Entity Profiler (PCEP)** - Detects explicit protected classes (race, gender, age, etc.)
2. **Implicit Resolution** - Maps group references to protected classes
3. **Stereotype Pattern Extraction** - Identifies bias patterns and stereotypes
4. **Group Generalization Detection** - Detects universal claims about groups
5. **Bias Type Classification** - Categorizes bias types (explicit, implicit, structural, etc.)
6. **Causal Inference Mapping** - Links identity → trait → harm relationships
7. **Contextual Severity Engine** - Calculates severity scores (0-10) with context awareness

---

## 💻 Usage

### Web Application

1. **Landing Page** - Visit the homepage to learn about BiasGuard
2. **Editor** - Navigate to `/editor` to start writing and analyzing text
3. **Dashboard** - View your analysis history and usage statistics
4. **Pricing** - Choose a plan that fits your needs

### Chrome Extension

1. **Install the extension**
   ```bash
   cd biasguard-extension
   # Load unpacked extension in Chrome (chrome://extensions/)
   ```

2. **Use on any website**
   - Click the BiasGuard icon in your browser toolbar
   - Select text on any webpage
   - Get instant bias analysis
   - Works on Gmail, Google Docs, Twitter, LinkedIn, and more

---

## 🔌 API Documentation

### Analyze Text

**Endpoint:** `POST /api/analyze`

**Request:**
```json
{
  "text": "Your text to analyze"
}
```

**Response:**
```json
{
  "bias_score": 7.5,
  "bias_level": "moderate",
  "protected_classes": ["gender", "age"],
  "bias_types": ["stereotype", "explicit"],
  "issues": [
    {
      "text": "women are",
      "start": 0,
      "end": 8,
      "type": "stereotype",
      "severity": 7,
      "suggestion": "Consider using more specific language"
    }
  ],
  "suggested_rewrite": "People are...",
  "analysis_metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "processing_time_ms": 45
  }
}
```

### Check Usage

**Endpoint:** `GET /api/user/check-usage`

**Response:**
```json
{
  "checksUsed": 50,
  "checksLimit": 100,
  "plan": "free",
  "periodStart": "2024-01-01T00:00:00Z",
  "periodEnd": "2024-02-01T00:00:00Z"
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in `biasguard-app/`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database (if using)
DATABASE_URL=postgresql://...

# Authentication (if using)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3001
```

### Next.js Configuration

The project uses Next.js 14 with:
- TypeScript for type safety
- Tailwind CSS for styling
- Server Components for optimal performance
- API Routes for backend functionality

### Chrome Extension Configuration

Update `biasguard-extension/manifest.json` to configure:
- Permissions
- Content script matches
- API endpoints

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start on port 3001
npm run dev:3000     # Start on port 3000
npm run dev:5000     # Start on port 5000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- Framer Motion (animations)
- Radix UI (components)
- Zustand (state management)
- TanStack Query (data fetching)

**Backend:**
- Next.js API Routes
- Stripe (payments)
- Node.js

**Chrome Extension:**
- Manifest V3
- Content Scripts
- Service Workers

---

## 📦 Subscription Plans

### Free Plan
- 100 bias checks per month
- Basic bias detection
- Email support

### Pro Plan ($19/month)
- 5,000 bias checks per month
- Advanced bias detection
- Priority support
- Export analysis reports
- API access

### Enterprise Plan ($99/month)
- Unlimited bias checks
- Advanced bias detection
- Dedicated support
- Custom integrations
- SLA guarantee
- Team management

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by the BiasGuard team
- Powered by Next.js and React
- Special thanks to all contributors

---

## 📞 Support

- **Documentation:** See this README
- **Issues:** Open an issue on GitHub
- **Email:** support@biasguard.com (for Pro/Enterprise users)

---

## 🗺️ Roadmap

- [ ] Enhanced bias pattern detection
- [ ] Multi-language support
- [ ] API rate limiting improvements
- [ ] Advanced analytics dashboard
- [ ] Integration with popular writing tools
- [ ] Machine learning model improvements

---

<div align="center">

**Made with ❤️ for inclusive communication**

[Website](https://biasguard.com) • [Documentation](#) • [Chrome Extension](#)

</div>

