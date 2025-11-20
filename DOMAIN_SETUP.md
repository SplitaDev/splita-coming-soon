# Connecting Your Google Domain

This guide will help you connect a domain purchased from Google Domains to your hosting service.

## Prerequisites

- Domain purchased from Google Domains
- Your site deployed to a hosting service (Vercel, Netlify, etc.)
- Access to your hosting provider's DNS settings

---

## Step 1: Get Your Hosting DNS Information

First, you need to get the DNS records from your hosting provider. The method depends on where you're hosting:

### If using Vercel:
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your domain (e.g., `yourdomain.com`)
4. Vercel will show you DNS records to add:
   - **A Record**: Points to Vercel's IP
   - **CNAME Record**: Points to Vercel's domain (e.g., `cname.vercel-dns.com`)

### If using Netlify:
1. Go to your site in Netlify dashboard
2. Navigate to **Domain settings**
3. Add your custom domain
4. Netlify will provide DNS records:
   - **A Record** or **CNAME Record** depending on your setup

### If using other hosting:
- Check your hosting provider's documentation for DNS settings
- You'll typically need either:
  - **A Record**: Points to an IP address
  - **CNAME Record**: Points to a hostname
  - **Nameservers**: Complete DNS management

---

## Step 2: Configure DNS in Google Domains

### Option A: Using Nameservers (Recommended for most hosting providers)

This is the easiest method if your hosting provider manages DNS:

1. **Log into Google Domains**
   - Go to [domains.google.com](https://domains.google.com)
   - Sign in with your Google account

2. **Select your domain**
   - Click on the domain you want to configure

3. **Go to DNS settings**
   - Click on **DNS** in the left sidebar
   - Scroll to the **Name servers** section

4. **Update nameservers**
   - Click **Use custom name servers**
   - Enter the nameservers provided by your hosting provider
   - Example for Vercel:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Example for Netlify:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```
   - Click **Save**

5. **Wait for propagation**
   - DNS changes can take 24-48 hours to propagate
   - Usually works within a few hours

### Option B: Using DNS Records (A/CNAME)

If you need to keep Google's nameservers or your hosting provider doesn't offer nameservers:

1. **Log into Google Domains**
   - Go to [domains.google.com](https://domains.google.com)
   - Sign in with your Google account

2. **Select your domain**
   - Click on the domain you want to configure

3. **Go to DNS settings**
   - Click on **DNS** in the left sidebar
   - Scroll to the **Custom resource records** section

4. **Add DNS records**
   - Click **Manage custom records**
   
   **For root domain (yourdomain.com):**
   - Add an **A Record**:
     - Name: `@` (or leave blank)
     - Type: `A`
     - TTL: `3600` (or default)
     - Data: Your hosting provider's IP address
   
   **For www subdomain (www.yourdomain.com):**
   - Add a **CNAME Record**:
     - Name: `www`
     - Type: `CNAME`
     - TTL: `3600` (or default)
     - Data: Your hosting provider's hostname (e.g., `cname.vercel-dns.com`)

5. **Save changes**
   - Click **Save**
   - Wait for DNS propagation (24-48 hours, usually faster)

---

## Step 3: Verify Your Domain

After configuring DNS:

1. **Wait for DNS propagation** (can take a few minutes to 48 hours)
   - Check propagation status: [whatsmydns.net](https://www.whatsmydns.net)
   - Enter your domain and check if DNS records are updated globally

2. **Verify in your hosting provider**
   - Most hosting providers will automatically detect and verify your domain
   - You may need to click a "Verify" button in your hosting dashboard

3. **Test your domain**
   - Once verified, visit your domain in a browser
   - It should load your site!

---

## Common Issues & Solutions

### Domain not resolving
- **Wait longer**: DNS propagation can take up to 48 hours
- **Check DNS records**: Verify you entered the correct records
- **Clear DNS cache**: 
  - On Mac: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
  - On Windows: `ipconfig /flushdns`
  - Or use a different network/device

### SSL Certificate issues
- Most modern hosting providers (Vercel, Netlify) automatically provision SSL certificates
- Wait a few minutes after domain verification for SSL to be issued
- Ensure your hosting provider supports automatic SSL

### www vs non-www
- Configure both `yourdomain.com` and `www.yourdomain.com`
- Most hosting providers allow you to set a preferred version
- Add redirects if needed (usually handled by hosting provider)

---

## Quick Reference: Popular Hosting Providers

### Vercel
- **Nameservers**: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
- **Or A Record**: Check Vercel dashboard for IP
- **CNAME**: `cname.vercel-dns.com` (for www)

### Netlify
- **Nameservers**: Provided in Netlify dashboard (varies by account)
- **Or A Record**: Check Netlify dashboard
- **CNAME**: Provided in Netlify dashboard

### GitHub Pages
- **A Records**: 
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME**: `yourusername.github.io` (for www)

### Cloudflare Pages
- Use Cloudflare's nameservers (if domain is on Cloudflare)
- Or configure DNS records in Cloudflare dashboard

---

## Additional Resources

- [Google Domains Help](https://support.google.com/domains)
- [DNS Propagation Checker](https://www.whatsmydns.net)
- Your hosting provider's domain documentation

---

## Need Help?

If you're stuck:
1. Check your hosting provider's domain setup documentation
2. Verify DNS records are correct using a DNS lookup tool
3. Contact your hosting provider's support
4. Check Google Domains support for DNS configuration help

