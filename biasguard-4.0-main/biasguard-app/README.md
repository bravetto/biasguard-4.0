# BiasGuard 4.0 Web Application

A production-ready, Grammarly-style web interface for BiasGuard 4.0 - real-time bias detection and mitigation.

## Features

- ✨ **Real-time Bias Detection** - Get instant analysis as you type (800ms debounce)
- 🎯 **7-Layer Analysis** - Comprehensive bias detection using advanced algorithms
- 📊 **Detailed Insights** - Understand bias severity, protected classes, and patterns
- ✏️ **Neutral Rewrites** - Automatically generate inclusive alternatives
- 🎨 **Beautiful UI** - Grammarly-inspired interface with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Radix UI** - Accessible component primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd biasguard-app
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file:
```
BIASGUARD_API_URL=http://localhost:3000
BIASGUARD_API_KEY=your-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── editor/            # Editor page
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── BiasEditor/       # Editor components
│   ├── Analysis/          # Analysis sidebar
│   └── Layout/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and types
└── store/                 # Zustand store
```

## Usage

### Editor Page

1. Navigate to `/editor`
2. Start typing in the editor
3. Bias detection happens automatically
4. View detailed analysis in the sidebar
5. See highlighted bias patterns in the text

### API Integration

The app connects to the BiasGuard 4.0 backend via the `/api/analyze` route. Make sure your BiasGuard backend is running and accessible.

## Building for Production

```bash
npm run build
npm start
```

## Features in Detail

### Real-Time Analysis
- Debounced analysis (800ms) for optimal performance
- Automatic re-analysis on text changes
- Loading states and error handling

### Bias Highlighting
- Color-coded highlights based on severity
- Hover tooltips with detailed information
- Click to see suggestions

### Analysis Sidebar
- Bias score gauge with visual indicator
- Detailed issue cards
- Protected classes detection
- Suggested rewrites

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for inclusive writing

