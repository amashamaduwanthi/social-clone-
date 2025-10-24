# Social Media Clone

A modern social media platform built with React, TypeScript, and Firebase. This application allows users to create accounts, share posts, interact with content, and connect with others.

## ✨ Features

- 🔐 **Authentication**: Secure user signup and login
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Real-time Updates**: Live updates for posts and interactions
- 📝 **Rich Post Creation**: Create and share posts with text and media
- 🔄 **State Management**: Efficient state handling with React Context
- 🎨 **Modern UI**: Clean and intuitive user interface

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Modules
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Linting**: ESLint
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Firebase account (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amashamaduwanthi/social-clone-.git
   cd social-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API and service integrations
├── styles/        # Global styles and CSS modules
└── utils/         # Utility functions and helpers
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


