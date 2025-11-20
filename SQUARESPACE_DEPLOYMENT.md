# Hosting on Squarespace Guide

Squarespace doesn't directly host React applications, but there are several ways to integrate your Splita coming soon page with Squarespace.

## Option 1: Embed as Custom Code Block (Recommended)

This method embeds your built React app into a Squarespace page.

### Step 1: Build Your React App

```bash
npm run build
```

This creates a `dist/` folder with static files.

### Step 2: Host the Built Files

You need to host the `dist/` folder somewhere. Options:

**A. Netlify (Free & Easy)**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `dist/` folder
3. Get your URL (e.g., `https://splita-coming-soon.netlify.app`)

**B. Vercel (Free & Easy)**
1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

**C. GitHub Pages**
1. Push your code to GitHub
2. Enable GitHub Pages
3. Set source to `dist/` folder

### Step 3: Embed in Squarespace

1. **In Squarespace Editor:**
   - Add a new page or edit existing page
   - Click "Add Section" → "Code"
   - Paste this code:

```html
<div id="splita-app-container"></div>
<script>
  // Load your React app
  (function() {
    const container = document.getElementById('splita-app-container');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://your-app-url.netlify.app'; // Replace with your hosted URL
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.minHeight = '800px';
    container.appendChild(iframe);
  })();
</script>
```

2. **Or use a full-page redirect:**
   - In Squarespace, go to Settings → Advanced → Code Injection
   - Add to Header:

```html
<script>
  // Redirect to your hosted app
  if (window.location.pathname === '/coming-soon' || window.location.pathname === '/') {
    window.location.href = 'https://your-app-url.netlify.app';
  }
</script>
```

## Option 2: Custom Domain Setup

If you want to use your Squarespace domain:

### Step 1: Host Your App

Deploy to Netlify, Vercel, or similar service.

### Step 2: Configure DNS in Squarespace

1. **In Squarespace:**
   - Go to Settings → Domains
   - Click on your domain
   - Go to DNS Settings

2. **Add CNAME Record:**
   - Type: `CNAME`
   - Host: `coming-soon` (or `www` or leave blank for root)
   - Points to: `your-app.netlify.app` (or your hosting provider's domain)

3. **In Your Hosting Provider (Netlify/Vercel):**
   - Add your custom domain
   - Configure SSL (usually automatic)

### Step 3: Update Squarespace Homepage

- Set your homepage to redirect to the subdomain, or
- Use a custom page that embeds your app

## Option 3: Squarespace Developer Platform (Advanced)

If you have Squarespace Developer access:

1. Create a custom template
2. Add your React app as a custom block
3. Build and deploy through Squarespace

## Option 4: Hybrid Approach (Best UX)

Keep Squarespace for your main site, host the coming soon page separately:

1. **Main Site:** `splita.co` (Squarespace)
2. **Coming Soon:** `coming-soon.splita.co` or `splita.co/coming-soon` (Hosted React app)

### Setup:

1. **Deploy React app** to Netlify/Vercel
2. **Add subdomain** in your DNS:
   - `coming-soon.splita.co` → points to your Netlify/Vercel URL
3. **Link from Squarespace:**
   - Add a button/link in Squarespace that goes to `coming-soon.splita.co`

## Recommended: Netlify Deployment (Easiest)

### Quick Steps:

1. **Build your app:**
```bash
npm run build
```

2. **Deploy to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `dist/` folder
   - Get your URL: `https://random-name-123.netlify.app`

3. **Add custom domain:**
   - In Netlify: Site settings → Domain management
   - Add custom domain: `coming-soon.splita.co`
   - Follow DNS instructions

4. **Update environment variables in Netlify:**
   - Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = your backend API URL

5. **Link from Squarespace:**
   - Add a "Coming Soon" page in Squarespace
   - Add a button that links to `coming-soon.splita.co`
   - Or redirect the homepage temporarily

## Environment Variables for Production

When deploying, make sure to set:

- `VITE_API_BASE_URL` - Your backend API URL
- Any other environment variables your app needs

## Testing

1. Build locally: `npm run build`
2. Test the build: `npm run preview`
3. Deploy to hosting service
4. Test the live URL
5. Update Squarespace to link/embed

## Troubleshooting

**Issue: App doesn't load in Squarespace**
- Make sure you're using HTTPS
- Check CORS settings if calling APIs
- Verify the iframe/embed code is correct

**Issue: Styling looks broken**
- Check that all assets are loading correctly
- Verify paths are relative, not absolute
- Check browser console for errors

**Issue: API calls failing**
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS headers on your backend
- Ensure backend is accessible from the hosting domain

## Alternative: Use Squarespace's Built-in Coming Soon

If you just need a simple coming soon page, Squarespace has a built-in feature:
- Settings → Site Availability → Password Protected
- This is simpler but less customizable than your React app

## Best Practice Recommendation

**Recommended Setup:**
1. Host React app on Netlify/Vercel (free, fast, easy)
2. Use subdomain: `coming-soon.splita.co`
3. Keep main site on Squarespace: `splita.co`
4. Link between them as needed

This gives you:
- ✅ Full control over your React app
- ✅ Fast hosting (CDN)
- ✅ Easy updates (just redeploy)
- ✅ Professional domain setup
- ✅ Squarespace for main site content

