# Mind Dump PWA 🧠

A therapeutic tool to organize your thoughts and get AI-powered insights.

## 🚀 Quick Deploy to Vercel

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `mind-dump-pwa`
4. Make it public
5. Click "Create repository"

### Step 2: Upload Files
1. Click "uploading an existing file"
2. Drag and drop ALL the files from this project
3. Commit with message: "Initial PWA setup"

### Step 3: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your `mind-dump-pwa` repository
5. Click "Deploy"

**That's it! Your PWA will be live at: `https://mind-dump-pwa.vercel.app`**

## 📱 PWA Features

- ✅ **Installable** - Users can install it like a native app
- ✅ **Offline Support** - Works without internet connection
- ✅ **Auto Updates** - Updates automatically when you push changes
- ✅ **Mobile Optimized** - Perfect on phones and tablets
- ✅ **Desktop Support** - Works great on computers too

## 🛠 Making Changes

### Option 1: Edit on GitHub (Easiest)
1. Go to your GitHub repository
2. Click on any file to edit it
3. Make your changes
4. Click "Commit changes"
5. Vercel will automatically deploy your changes in ~30 seconds

### Option 2: Edit Locally
1. Download the repository as ZIP
2. Edit files in any text editor
3. Upload changed files back to GitHub
4. Changes deploy automatically

## 📁 File Structure

```
mind-dump-pwa/
├── package.json          # Dependencies
├── vite.config.js        # PWA configuration
├── index.html           # Main HTML file
├── src/
│   ├── main.jsx         # App entry point
│   ├── App.jsx          # Root component
│   ├── components/
│   │   └── MindDumpApp.jsx  # Main app component
│   └── styles/
│       └── app.css      # All styling
└── README.md           # This file
```

## 🎨 Customization Guide

### Colors
All colors are defined in `src/components/MindDumpApp.jsx`:
- `#262624` - Dark text
- `#908F88` - Gray text/borders
- `#F9F9F9` - Light background
- `#CD6741` - Orange accent

### Text & Content
- **Placeholders**: Edit the `placeholders` array in `MindDumpApp.jsx`
- **Main title**: Look for "Let's Organize Your Brain"
- **Button text**: Search for button text like "Done. Show Me Insights"

### Styling
- **Animations**: Edit `src/styles/app.css`
- **Layout**: Modify the JSX in `MindDumpApp.jsx`
- **Fonts**: Currently uses JetBrains Mono

### AI Analysis
The Claude API integration is in the `processNotes` function. You'll need to:
1. Set up a Claude API key
2. Create an API route in Vercel for security
3. Update the fetch URL

## 🔧 Development Commands

If you want to run locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Testing Your PWA

1. Open your deployed site on mobile
2. Look for "Add to Home Screen" prompt
3. Install it and test offline functionality
4. Share the link - others can install it too!

## 🆘 Need Help?

- **File issues**: Create GitHub issues in your repository
- **Ask Claude**: Share specific file contents with Claude for help
- **Vercel docs**: Check [Vercel documentation](https://vercel.com/docs)

## 🎯 Next Steps

1. **Deploy** following the steps above
2. **Test** the PWA on your phone
3. **Customize** colors, text, or features
4. **Share** with friends to try!

Your Mind Dump PWA is ready to help organize thoughts and provide insights! 🚀