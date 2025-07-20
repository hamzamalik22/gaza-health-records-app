#!/bin/bash

echo "🚀 Building for production..."
npm run build

echo "✅ Build completed!"
echo ""
echo "📋 Next steps for Netlify deployment:"
echo "1. Go to https://app.netlify.com/"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New site from Git'"
echo "4. Choose your GitHub repository"
echo "5. Set build command: npm run build"
echo "6. Set publish directory: dist"
echo "7. Click 'Deploy site'"
echo ""
echo "🔧 Environment Variables to add in Netlify:"
echo "- VITE_SUPABASE_URL=your_supabase_url"
echo "- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo ""
echo "📁 Your dist folder is ready for deployment!" 