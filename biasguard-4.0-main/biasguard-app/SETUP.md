# BiasGuard Web App - Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
cd biasguard-app
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the `biasguard-app` directory:

```env
BIASGUARD_API_URL=http://localhost:3000
BIASGUARD_API_KEY=your-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Note**: The API route is currently configured to use the BiasGuard analyzer directly from the parent directory. If you want to use a separate API service, update `src/app/api/analyze/route.ts`.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
biasguard-app/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and types
│   └── store/            # State management
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Key Features Implemented

✅ **Real-time Bias Detection** - 800ms debounced analysis  
✅ **Interactive Editor** - ContentEditable with bias highlighting  
✅ **Analysis Sidebar** - Detailed bias insights and suggestions  
✅ **Landing Page** - Modern marketing page with features and pricing  
✅ **Dashboard** - Analytics and usage statistics  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Smooth Animations** - Framer Motion for polished UX  

## API Integration

The app uses the BiasGuard 4.0 analyzer directly. The API route (`src/app/api/analyze/route.ts`) imports the analyzer from the parent directory.

### To Use External API:

1. Update `.env.local` with your API URL
2. Modify `src/app/api/analyze/route.ts` to use `fetch()` instead of direct import
3. Ensure your API returns the same response format as defined in `src/lib/types.ts`

## Troubleshooting

### Module Import Errors

If you see errors importing the BiasGuard analyzer, ensure:
- The parent `biasguard-4.0-main` directory exists
- The analyzer module exports correctly
- Node.js can resolve the module path

### TypeScript Errors

Run:
```bash
npm run build
```

This will show any TypeScript errors that need fixing.

### Styling Issues

Ensure Tailwind CSS is properly configured:
```bash
npm install -D tailwindcss postcss autoprefixer
```

## Next Steps

1. **Add Authentication** - Implement user accounts
2. **Add Database** - Store analysis history
3. **Add Export Features** - PDF, DOCX export
4. **Add Sharing** - Share analysis results
5. **Add Dark Mode** - Theme switching
6. **Add More Charts** - Enhanced dashboard analytics

## Production Build

```bash
npm run build
npm start
```

For deployment on Vercel:
```bash
vercel
```

---

**Ready to use!** Start the dev server and navigate to `http://localhost:3000`

