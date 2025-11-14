# Push to GitHub - Step by Step

## Prerequisites
1. Install Git: https://git-scm.com/download/win
2. Create GitHub account: https://github.com

## Steps

### 1. Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `typing-speed-test`
4. Description: `Modern typing speed test with authentication and performance tracking`
5. Keep it Public
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push Your Code
Open Command Prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: TypeSpeed - Modern Typing Speed Test"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/typing-speed-test.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Verify
- Visit your GitHub repository
- Check that all files are uploaded
- Verify README.md displays correctly

## Important Notes
- Your Firebase config is excluded from git for security
- Users will need to set up their own Firebase project
- The README.md includes setup instructions