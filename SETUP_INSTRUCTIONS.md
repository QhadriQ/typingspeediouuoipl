# Setup and GitHub Push Instructions

## Firebase Setup (Required)

1. Go to https://console.firebase.google.com/
2. Create a new project named "TypeSpeed"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Start collection: "testResults"
5. Get your config:
   - Go to Project Settings > General
   - Scroll to "Your apps" > Web app
   - Copy the firebaseConfig object
6. Update `src/firebase.js` with your config

## Git Setup and Push to GitHub

### Step 1: Install Git (if not installed)
Download from: https://git-scm.com/downloads

### Step 2: Initialize and Push

Open Command Prompt in the project folder and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TypeSpeed typing test app"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/QhadriA/typing-speed-test.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create GitHub Repository First

1. Go to https://github.com/QhadriA
2. Click "New repository"
3. Name it: "typing-speed-test"
4. Don't initialize with README (we already have one)
5. Click "Create repository"
6. Copy the repository URL
7. Run the git commands above

## Running the App

```bash
npm start
```

## Building for Production

```bash
npm run build
```

## Important Notes

- Never commit `src/firebase.js` with real API keys
- The `.gitignore` file is configured to exclude it
- Keep a backup of your Firebase config separately
