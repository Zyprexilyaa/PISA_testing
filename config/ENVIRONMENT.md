# Environment Variables

Copy these files and set the actual values for your environment.

## Frontend Environment Variables

Create `.env.local` in the `frontend/` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Backend Functions URL
VITE_FUNCTIONS_URL=http://localhost:5000  # Local development
# VITE_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net  # Production
```

### Getting Firebase Configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Project Settings" (gear icon)
4. Copy the configuration from "Your web app"

---

## Backend Functions Environment Variables

Create `.env.local` in `backend/functions/` directory:

```env
# Google AI API Key (for Gemini access)
GOOGLE_API_KEY=your_google_api_key

# Gemini Model
GEMINI_MODEL=gemini-pro

# Google Cloud Project ID
GCP_PROJECT_ID=your_project_id

# Cloud Speech-to-Text Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### Getting Google API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable these APIs:
   - Generative AI API
   - Cloud Speech-to-Text API
4. Go to "Credentials" > "Create Credentials" > "API Key"
5. Copy your API Key

### Getting Service Account Key (for Cloud Speech-to-Text):

1. In Google Cloud Console: "Credentials" > "Service Accounts"
2. Create a new service account
3. Click on the account > "Keys" > "Add Key" > "JSON"
4. Download the JSON file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of this file

---

## Development Configuration

For local development, you can use the Firebase Emulator Suite:

Create `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

Then start the emulator:
```bash
firebase emulators:start
```

This will run Firestore, Storage, and Functions locally on your machine.

---

## Production Deployment

1. Set environment variables in Firebase Functions:
   ```bash
   firebase functions:config:set google.api_key="your_api_key"
   firebase functions:config:set google.project="your_project_id"
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. Update frontend `VITE_FUNCTIONS_URL` to your deployed functions URL.
