# Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Navigate to project directory:
```bash
cd CodeRabbit
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? **dev-playground** (or your preferred name)
   - Directory? **./** (press Enter)
   - Override settings? **No**

5. For production deployment:
```bash
vercel --prod
```

### Method 2: GitHub Integration (Recommended for Continuous Deployment)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Dev Playground"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dev-playground.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Click "Deploy"

7. Your app will be live at: `https://your-project.vercel.app`

## Environment Variables

No environment variables are required for this project.

## Build Settings

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

## Post-Deployment

After deployment, you can:
- Set up custom domain in Vercel dashboard
- Configure automatic deployments on git push
- View deployment logs and analytics
- Set up preview deployments for branches

## Troubleshooting

**Build fails?**
- Ensure all dependencies are in `package.json`
- Check Node.js version (use Node 18+)
- Clear cache: `vercel --force`

**404 on routes?**
- Ensure `vercel.json` exists with proper rewrites
- Check that routing is configured correctly

**Styles not loading?**
- Verify Tailwind CSS configuration
- Check `postcss.config.js` exists
- Ensure `style.css` imports Tailwind directives
