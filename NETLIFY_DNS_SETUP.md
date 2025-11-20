# Netlify DNS Setup for splita.co

## Problem
Netlify says "splita.co doesn't appear to be served by Netlify" - this means the DNS records aren't pointing to Netlify yet.

## Solution: Point Your Domain to Netlify

### Step 1: Get Netlify DNS Records

1. **In Netlify Dashboard:**
   - Go to your site
   - Click **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter: `splita.co`
   - Netlify will show you DNS records to add

2. **Netlify will provide one of these options:**

   **Option A: Use Netlify Nameservers (Easiest)**
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
   
   **Option B: Use A/CNAME Records**
   - A Record: Points to Netlify's IP (e.g., `75.2.60.5`)
   - CNAME Record: Points to your Netlify site (e.g., `your-site.netlify.app`)

### Step 2: Configure DNS in Google Domains

#### Method 1: Use Netlify Nameservers (Recommended)

1. **Go to Google Domains:**
   - Visit [domains.google.com](https://domains.google.com)
   - Sign in and select `splita.co`

2. **Update Nameservers:**
   - Click **DNS** in the left sidebar
   - Scroll to **Name servers** section
   - Click **Use custom name servers**
   - Enter the nameservers Netlify provided:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```
   - Click **Save**

3. **Wait for Propagation:**
   - DNS changes take 24-48 hours (usually works within a few hours)
   - Netlify will automatically detect when DNS is configured

#### Method 2: Use DNS Records (If you want to keep Google's nameservers)

1. **In Google Domains:**
   - Go to **DNS** settings
   - Scroll to **Custom resource records**

2. **Add A Record for Root Domain:**
   - Click **Manage custom records**
   - Add:
     - **Name:** `@` (or leave blank)
     - **Type:** `A`
     - **TTL:** `3600`
     - **Data:** Netlify's IP address (from Netlify dashboard)

3. **Add CNAME for www (optional):**
   - **Name:** `www`
   - **Type:** `CNAME`
   - **TTL:** `3600`
   - **Data:** Your Netlify site URL (e.g., `your-site.netlify.app`)

### Step 3: Verify in Netlify

1. **Wait 5-10 minutes** after updating DNS
2. **In Netlify:**
   - Go to Domain management
   - Click **Verify DNS configuration**
   - Netlify will check if DNS is pointing correctly

3. **Check DNS Propagation:**
   - Visit [whatsmydns.net](https://www.whatsmydns.net)
   - Enter `splita.co`
   - Check if it shows Netlify's IP/nameservers globally

### Step 4: SSL Certificate

- Netlify automatically provisions SSL certificates
- Once DNS is verified, SSL will be issued automatically
- Usually takes 5-10 minutes after DNS verification

## Troubleshooting

### "DNS verification failed" Error

**Common causes:**
1. **DNS hasn't propagated yet** - Wait 1-2 hours
2. **Wrong nameservers** - Double-check you entered them correctly
3. **Still using Google's nameservers** - Make sure you clicked "Use custom name servers"
4. **Cached DNS** - Clear your DNS cache:
   ```bash
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   ```

### Check Current DNS Configuration

**In Google Domains:**
- Go to DNS settings
- Check what nameservers are currently set
- If it shows Google's nameservers, you need to change them

**Using Terminal:**
```bash
# Check nameservers
dig NS splita.co

# Check A record
dig A splita.co
```

### Quick Fix: Use Netlify Subdomain First

If you want to test immediately:

1. **Use Netlify's default URL:**
   - Your site is already live at: `https://your-site-name.netlify.app`
   - You can use this while DNS propagates

2. **Set up custom domain later:**
   - Once DNS is configured, `splita.co` will work
   - Netlify will automatically redirect the Netlify URL to your custom domain

## Step-by-Step Checklist

- [ ] Deployed site to Netlify (got Netlify URL)
- [ ] Added `splita.co` as custom domain in Netlify
- [ ] Got nameservers/DNS records from Netlify
- [ ] Logged into Google Domains
- [ ] Updated nameservers to Netlify's (or added A/CNAME records)
- [ ] Saved changes in Google Domains
- [ ] Waited 1-2 hours for DNS propagation
- [ ] Verified DNS in Netlify dashboard
- [ ] Checked SSL certificate is issued
- [ ] Tested `splita.co` in browser

## Expected Timeline

- **DNS Update:** Immediate (in Google Domains)
- **DNS Propagation:** 1-48 hours (usually 1-4 hours)
- **Netlify Detection:** Automatic once DNS propagates
- **SSL Certificate:** 5-10 minutes after DNS verification

## Need Help?

If DNS still isn't working after 24 hours:
1. Double-check nameservers are correct
2. Verify in Google Domains that changes were saved
3. Check Netlify dashboard for specific error messages
4. Contact Netlify support with your domain and site name

