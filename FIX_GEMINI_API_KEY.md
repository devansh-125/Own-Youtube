# ❌ Gemini API Key Issue

## Problem
The Gemini API key in your `.env` file appears to be **invalid or incomplete**.

Current key: `AIzaSyA1n7I4QfLvDZvipj69gyjWwSPtNSGp_yo`

Error: `API_KEY_INVALID` - Please pass a valid API key

---

## How to Get a Valid Gemini API Key

### Step 1: Go to Google AI Studio
1. Open: https://aistudio.google.com/apikey
2. Sign in with your Google account (create one if needed)

### Step 2: Create a New API Key
1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"**
3. Wait for it to generate

### Step 3: Copy the Key
1. You'll see a long string like: `AIza...` (much longer than current)
2. Copy it completely

### Step 4: Update .env File
Replace line 20 in `/Backend/.env`:

```properties
GEMINI_API_KEY=<YOUR_NEW_API_KEY_HERE>
```

**Example** (do NOT use this):
```properties
GEMINI_API_KEY=AIzaSyA1n7I4QfLvDZvipj69gyjWwSPtNSGp_yo12345abcdefghijklmnopqr
```

---

## Verify the Key Works

After updating, run:
```bash
cd Backend
node --experimental-json-modules generateExistingVideoEmbeddings.js
```

You should see:
```
✅ MongoDB connected!
🔍 Finding existing videos without embeddings...
📊 Found 3 videos that need embeddings
[33%] Processing: "Video Name"
   ✅ Embedding generated and saved!
```

---

## Important Notes

⚠️ **Keep your API key PRIVATE**
- Never commit it to GitHub
- Never share it publicly
- The `.env` file is already in `.gitignore`

✅ **Free Tier Available**
- Google gives you free credits for Generative AI
- Embedding API has generous free limits
- No credit card needed initially

---

## What To Do Now

1. ✅ Get new API key from https://aistudio.google.com/apikey
2. ✅ Update `.env` file (line 20)
3. ✅ Run the embedding generation script again
4. ✅ Your existing videos will have embeddings!

