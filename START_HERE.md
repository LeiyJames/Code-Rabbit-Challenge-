# 🚀 START HERE - Dev Playground

Welcome! This is your complete guide to getting the Dev Playground up and running.

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Dependencies
Open your terminal in the `CodeRabbit` folder and run:

```bash
npm install
```

This will install all required packages (~2-3 minutes on first run).

### 2️⃣ Start Development Server
```bash
npm run dev
```

The app will start at **http://localhost:5173**

### 3️⃣ Open in Browser
Visit `http://localhost:5173` and you should see:
- A dark hero section with "Dev Playground"
- A grid of 4 project cards below
- Each card has a "Run Project" button

**That's it!** 🎉 Your development environment is ready.

---

## 🧪 Test the Projects

Click "Run Project" on each card to test:

1. **Calculator** - Try some math operations
2. **Counter** - Click increment/decrement buttons  
3. **Lorem Ipsum** - Generate and copy placeholder text
4. **Password Generator** - Create a secure password

---

## 📂 Project Structure (Quick Reference)

```
CodeRabbit/
├── src/
│   ├── projects/         ← All 4 projects are here
│   ├── components/       ← ProjectCard & TechBadge
│   ├── views/            ← HomePage & PlaygroundPage
│   ├── data/             ← projects.ts registry
│   └── router/           ← Vue Router setup
├── package.json          ← Dependencies
├── tailwind.config.js    ← Styling config
└── vite.config.ts        ← Build config
```

---

## 🎨 Customize the App

### Change Colors
Edit `tailwind.config.js` → `theme.extend.colors.primary`

### Add a New Project
1. Create `src/projects/YourProject.vue`
2. Add it to `src/data/projects.ts`
3. Done! It appears automatically

### Modify Homepage
Edit `src/views/HomePage.vue`

---

## 🚀 Deploy to Vercel

### Option 1: Quick Deploy (5 minutes)
```bash
npm install -g vercel
vercel
```

Follow the prompts, then visit your live URL!

### Option 2: GitHub + Vercel (Auto-deploy on push)
1. Push code to GitHub
2. Go to vercel.com → Import Repository
3. Deploy with default settings

See `DEPLOYMENT.md` for detailed instructions.

---

## 📚 Documentation Index

- **START_HERE.md** ← You are here
- **QUICKSTART.md** - Developer quick reference
- **PROJECT_OVERVIEW.md** - Architecture deep-dive
- **DEPLOYMENT.md** - Deployment guide
- **CHECKLIST.md** - Completion checklist
- **README.md** - Main project documentation

---

## 🆘 Troubleshooting

### "npm install" fails?
- Ensure Node.js 18+ is installed: `node -v`
- Delete `node_modules` and `package-lock.json`, then retry

### Port 5173 already in use?
- Stop other Vite servers
- Or edit `vite.config.ts` to use a different port

### TypeScript errors?
- Run `npm run build` to see all errors
- Check `tsconfig.json` settings

### Styles not loading?
- Verify `src/style.css` imports Tailwind
- Check `tailwind.config.js` content paths

---

## ✅ Success Checklist

After running `npm run dev`, you should see:

- ✅ Dev server running on http://localhost:5173
- ✅ Homepage loads with hero + project grid
- ✅ All 4 project cards are visible
- ✅ Clicking "Run Project" navigates to `/playground/:slug`
- ✅ Projects load and function correctly
- ✅ "Back" button returns to homepage
- ✅ No console errors

---

## 🎯 What's Next?

### For Development:
1. Explore the 4 existing projects in `src/projects/`
2. Study the architecture in `PROJECT_OVERVIEW.md`
3. Try adding your own project (see QUICKSTART.md)

### For Deployment:
1. Build for production: `npm run build`
2. Test build: `npm run preview`
3. Deploy to Vercel (see DEPLOYMENT.md)

### For Portfolio:
1. Customize colors and branding
2. Add your own projects
3. Deploy to a custom domain
4. Add to your resume/portfolio

---

## 💡 Pro Tips

- Use `npm run dev` for hot-reloading during development
- Test production build before deploying: `npm run build && npm run preview`
- Keep projects self-contained in `src/projects/`
- Use TypeScript for type safety
- Follow existing code patterns for consistency

---

## 🎉 You're Ready!

Run `npm install && npm run dev` and start building!

Need help? Check the other documentation files or refer to:
- Vue 3 Docs: https://vuejs.org
- Tailwind Docs: https://tailwindcss.com
- Vite Docs: https://vitejs.dev

**Happy coding!** 🚀
