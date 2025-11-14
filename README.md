# TypeSpeed - Modern Typing Speed Test

A beautiful, feature-rich typing speed test application with authentication and performance tracking.

## Features

- 🎨 Modern UI with sci-fi aesthetics
- 🔐 User authentication (Email & Google)
- 📊 Real-time performance graphs
- 🏆 Personal best tracking with badges
- 🎯 Multiple difficulty levels (Easy, Medium, Hard)
- ⚡ Multiple modes (Sentences, Zen, CAPS)
- 📈 Detailed statistics (WPM, Accuracy, Errors)
- 💾 Cloud database storage

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/QhadriA/typing-speed-test.git
cd typing-speed-test
```

### 2. Install dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create a Firestore Database
5. Copy your Firebase config
6. Update `src/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run the application
```bash
npm start
```

## Technologies Used

- React 18
- Firebase (Authentication & Firestore)
- CSS3 with modern animations
- SVG for interactive graphs

## Features Breakdown

### Typing Modes
- **Sentences**: Practice with meaningful sentences
- **Zen**: Relaxed typing with common words
- **CAPS**: Practice uppercase typing

### Difficulty Levels
- **Easy**: Simple, common words
- **Medium**: Moderate complexity
- **Hard**: Advanced vocabulary

### Performance Tracking
- Real-time WPM calculation
- Accuracy percentage
- Error tracking
- Interactive performance graph with 25+ data points

### Badges
- 🥉 Bronze: < 40 WPM
- 🥈 Silver: 40-59 WPM
- 🏆 Gold: 60-79 WPM
- 💎 Diamond: 80+ WPM

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License
