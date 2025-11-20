# Splita Coming Soon

A minimal, password-protected coming soon page for Splita.

## Features

- 🔒 Password protection
- 📧 Email signup form
- ✨ Minimal design with Splita green glows
- 📱 Fully responsive
- 🚀 Ready to deploy

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set your password in `.env`:
```bash
VITE_COMING_SOON_PASSWORD=your-password-here
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Configuration

### Password

Set the password via environment variable:
```bash
VITE_COMING_SOON_PASSWORD=your-secure-password
```

Or edit `src/App.tsx` to change the default.

### Logo

Replace `public/logo.png` with your Splita logo, or update the logo path in `src/components/Logo.tsx`.

### Email Collection

Currently, email submission is simulated. To connect to your backend:

1. Update `src/App.tsx` in the `handleEmailSubmit` function
2. Add your API endpoint
3. Handle errors appropriately

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Netlify

1. Push to GitHub
2. Import project in Netlify
3. Set environment variables
4. Deploy

### Custom Domain

1. Build: `npm run build`
2. Upload `dist/` folder to your hosting
3. Point your custom domain to the deployment
4. Set environment variables in your hosting provider

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utilities
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Dependencies
```

## License

MIT

