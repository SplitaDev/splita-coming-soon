# Google Cloud Deployment Guide for Splita

This guide will help you deploy your Splita application to Google Cloud Platform (GCP).

## Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud CLI**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk)
3. **Billing Account**: Enable billing (free tier available)

## Deployment Options

You have two main options:

### Option 1: Cloud Run (Recommended)
- **Best for**: Containerized apps, auto-scaling, pay-per-use
- **Cost**: Free tier: 2 million requests/month
- **Setup**: Uses Docker

### Option 2: App Engine
- **Best for**: Simple Node.js apps, managed platform
- **Cost**: Free tier: 28 hours/day
- **Setup**: Uses app.yaml

---

## Option 1: Deploy to Cloud Run (Recommended)

### Step 1: Install Google Cloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Step 2: Initialize Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create splita-app --name="Splita Application"

# Set the project
gcloud config set project splita-app

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Build and Deploy

```bash
# Build the Docker image
gcloud builds submit --tag gcr.io/splita-app/splita-app

# Deploy to Cloud Run
gcloud run deploy splita-app \
  --image gcr.io/splita-app/splita-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Step 4: Set Environment Variables

```bash
gcloud run services update splita-app \
  --region us-central1 \
  --update-env-vars RESEND_API_KEY=your_resend_key_here \
  --update-env-vars RESEND_WAITLIST_AUDIENCE_ID=your_waitlist_id \
  --update-env-vars RESEND_VENDOR_AUDIENCE_ID=your_vendor_id \
  --update-env-vars PORT=8080 \
  --update-env-vars NODE_ENV=production
```

### Step 5: Get Your URL

After deployment, you'll get a URL like:
```
https://splita-app-xxxxx-uc.a.run.app
```

Update your frontend's `VITE_API_BASE_URL` to point to this URL.

---

## Option 2: Deploy to App Engine

### Step 1: Install Google Cloud CLI

```bash
brew install google-cloud-sdk
```

### Step 2: Initialize Google Cloud

```bash
gcloud auth login
gcloud projects create splita-app
gcloud config set project splita-app
gcloud app create --region=us-central
```

### Step 3: Deploy Backend

```bash
# Navigate to project root
cd "/Users/arinzeokigbo/Desktop/Splita/VibeCode Cursor/Splita-ComingSoon"

# Deploy backend
gcloud app deploy app.yaml
```

### Step 4: Set Environment Variables

In Google Cloud Console:
1. Go to **App Engine** → **Settings** → **Environment Variables**
2. Add:
   - `RESEND_API_KEY`
   - `RESEND_WAITLIST_AUDIENCE_ID`
   - `RESEND_VENDOR_AUDIENCE_ID`
   - `PORT=8080`
   - `NODE_ENV=production`

Or use gcloud CLI:
```bash
gcloud app deploy app.yaml --update-env-vars \
  RESEND_API_KEY=your_key,RESEND_WAITLIST_AUDIENCE_ID=your_id,RESEND_VENDOR_AUDIENCE_ID=your_id
```

### Step 5: Deploy Frontend Separately

For the frontend, you have options:

**Option A: Deploy to Cloud Storage + Cloud CDN**
```bash
# Build frontend
npm run build

# Create bucket
gsutil mb gs://splita-frontend

# Upload files
gsutil -m cp -r dist/* gs://splita-frontend/

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://splita-frontend

# Enable static website hosting
gsutil web set -m index.html gs://splita-frontend
```

**Option B: Deploy to Firebase Hosting (Recommended for frontend)**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

---

## Environment Variables Setup

### Required Variables

Set these in Google Cloud Console or via CLI:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `RESEND_API_KEY` | Resend API key | Resend dashboard |
| `RESEND_WAITLIST_AUDIENCE_ID` | Waitlist audience ID | Resend audiences |
| `RESEND_VENDOR_AUDIENCE_ID` | Vendor audience ID | Resend audiences |
| `PORT` | Server port | Default: 8080 |
| `NODE_ENV` | Environment | Set to `production` |

### Setting via Console

1. Go to **Cloud Run** → Select your service → **Edit & Deploy New Revision**
2. Click **Variables & Secrets** tab
3. Add each environment variable
4. Click **Deploy**

### Setting via CLI

```bash
gcloud run services update splita-app \
  --region us-central1 \
  --update-env-vars KEY1=value1,KEY2=value2
```

---

## Updating Frontend API URL

After deploying the backend, update your frontend:

1. **Update `src/lib/api.ts`**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-cloud-run-url.run.app';
```

2. **Or set build-time variable**:
```bash
VITE_API_BASE_URL=https://your-cloud-run-url.run.app npm run build
```

---

## Continuous Deployment (CI/CD)

### Using Cloud Build

1. **Connect GitHub repository**:
   - Go to **Cloud Build** → **Triggers**
   - Click **Create Trigger**
   - Connect your GitHub repo
   - Set build config to `cloudbuild.yaml`

2. **Automatic deployments**:
   - Every push to `main` will trigger a build
   - Cloud Build will build and deploy automatically

### Manual Build

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Monitoring & Logs

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read splita-app --region us-central1

# App Engine logs
gcloud app logs tail
```

### View in Console

- **Cloud Run**: Go to your service → **Logs** tab
- **App Engine**: Go to **App Engine** → **Logs**

---

## Cost Estimation

### Cloud Run (Free Tier)
- **2 million requests/month** free
- **400,000 GB-seconds** compute time free
- **200,000 CPU-seconds** free
- After free tier: ~$0.40 per million requests

### App Engine (Free Tier)
- **28 instance hours/day** free
- **1 GB outgoing traffic/day** free
- After free tier: ~$0.05 per instance hour

**For most use cases, you'll stay within the free tier!** 🎉

---

## Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds list
gcloud builds log BUILD_ID
```

### Service Won't Start

1. Check environment variables are set
2. Check logs: `gcloud run services logs read splita-app`
3. Verify health endpoint: `curl https://your-url.run.app/health`

### CORS Issues

Make sure your frontend URL is allowed in CORS settings (already configured in server).

---

## Quick Deploy Commands

### Cloud Run (All-in-one)

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/splita-app/splita-app && \
gcloud run deploy splita-app \
  --image gcr.io/splita-app/splita-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars RESEND_API_KEY=your_key,RESEND_WAITLIST_AUDIENCE_ID=your_id
```

### App Engine

```bash
gcloud app deploy app.yaml
```

---

## Next Steps

1. ✅ Deploy backend to Cloud Run or App Engine
2. ✅ Set environment variables
3. ✅ Deploy frontend to Firebase Hosting or Cloud Storage
4. ✅ Update frontend API URL
5. ✅ Test the deployment
6. ✅ Set up custom domain (optional)

## Support

- **Google Cloud Docs**: https://cloud.google.com/docs
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **App Engine Docs**: https://cloud.google.com/appengine/docs

---

**Your app will be live on Google Cloud!** 🚀

