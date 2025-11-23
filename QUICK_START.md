# 🚀 Quick Start Guide

**Get your portfolio running in 5 steps!**

## Step 1: Verify Requirements ✅

```bash
# Check Node.js version (need 18.17+)
node --version

# Check pnpm (need 8.0+)
pnpm --version

# If pnpm not installed:
npm install -g pnpm
```

## Step 2: Install Dependencies 📦

```bash
pnpm install
```

This will install:

- Next.js 16.0.3
- React 19
- TypeScript
- Tailwind CSS
- ESLint & Prettier

**⏱️ Takes:** ~2-3 minutes

## Step 3: Set Up Environment Variables 🔧

```bash
# Copy the template
cp env.example .env.local

# Edit with your info (optional for now)
# You can leave defaults for local development
```

**Variables you'll eventually need:**

- `NEXT_PUBLIC_SITE_URL` - Your domain
- `CONTACT_EMAIL` - Your email for contact form

## Step 4: Start Development Server 🏃

```bash
pnpm dev
```

**You'll see:**

```
▲ Next.js 16.0.3
- Local:   http://localhost:3000
✓ Ready in 1.5s
```

## Step 5: Open in Browser 🌐

Navigate to: **http://localhost:3000**

You should see the default Next.js welcome page!

---

## ✅ Success! What's Next?

Now that you're running, here's your roadmap:

### **Today (2-3 hours):**

1. **Read** `PORTFOLIO_BUILD_GUIDE.md` → Phase 0 (Discovery & Content)
2. **Gather** your content:
   - Write your bio (2-3 paragraphs)
   - List 3-5 projects with descriptions
   - Collect links (GitHub, LinkedIn, etc.)
3. **Create** `/content` folder and add your info

### **This Week:**

- [ ] Phase 1: Complete baseline setup (TypeScript strict mode, ESLint)
- [ ] Phase 2: Build layout components (Header, Footer, Container)
- [ ] Phase 3: Create your first pages (Home, About, Projects)

### **Next 2-4 Weeks:**

- [ ] Phase 4: Add i18n (English, French, Arabic)
- [ ] Phase 5: Dynamic features (contact form, projects API)
- [ ] Phase 6: Performance optimization
- [ ] Phase 7: Testing & deployment
- [ ] Phase 8: Launch! 🎉

---

## 🆘 Common First-Time Issues

### **Port 3000 already in use?**

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### **Module not found errors?**

```bash
# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### **TypeScript errors in IDE?**

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### **Fonts not loading (Next.js 16.0.3)?**

✅ **Already fixed!** We're using CSS `@font-face` to bypass the Turbopack bug.  
See `PORTFOLIO_BUILD_GUIDE.md` → Phase 2 → CRITICAL section.

---

## 📚 Resources

- **Full Build Guide:** [PORTFOLIO_BUILD_GUIDE.md](./PORTFOLIO_BUILD_GUIDE.md)
- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 💡 Pro Tips

1. **Commit early, commit often** - Start with `git init` and make your first commit
2. **Use VS Code extensions:**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript
3. **Keep dev server running** - Hot reload makes development fast
4. **Don't aim for perfection** - Ship version 1.0, iterate later

---

**Ready to build? Start with Phase 0 in the main guide!** 🚀

Questions? Check the debugging section in `PORTFOLIO_BUILD_GUIDE.md`
