# 🛡️ Stay Strong - The Ultimate Discipline Tracker

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> **"He who conquers himself is the mightiest warrior."**

**Stay Strong** is a gamified habit tracking application designed to help users break addiction and build iron-clad discipline. With a sleek **Cyberpunk/Neon Aesthetic**, it combines personal streak tracking with real-time PvP **Competition Modes** to keep you motivated.

## 🚀 Live Demo

**[👉 CLICK HERE TO TRY THE APP 👈](https://streak-engine-nofap.onrender.com/)**

---

## ✨ Key Features

- **🔥 Streak Engine**: Precision tracking of your sober days with visual progress bars and milestone badges.
- **⚔️ Competition Arena**:
  - **Host & Join Battles**: Create private rooms or join friends via unique codes.
  - **Real-time Status**: Live updates on your opponents' status.
  - **Last Man Standing**: Battle royale style habit tracking – if you relapse, you're out!
- **🎨 Immersive UI**:
  - **Neon/Dark Mode Aesthetic**: A premium, futuristic look that feels like a game.
  - **Smooth Animations**: Powered by CSS animations and transitions for a fluid experience.
  - **Custom Loaders**: Unique, themed loading states including a dedicated "Battle Loader".
- **🏆 Rank System**: Unlock badges and titles as your streak increases (Beginner -> Legend).
- **🔐 Secure Authentication**: JWT-based auth system to keep your progress safe.

## 🛠️ Tech Stack

### Frontend

- **React.js**: Core Component Library
- **Vite**: Lightning-fast build tool
- **SCSS (Sass)**: Advanced styling with variables, mixins, and nested rules for the Neon theme.
- **Axios**: API requests and interceptors.
- **React Router**: Client-side routing.

### Backend

- **Node.js & Express**: Robust REST API.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **JWT (JSON Web Token)**: Secure stateless authentication.

---

## 💻 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Huzaifa-Quadri/Streak-Engine.git
    cd streak-engine
    ```

2.  **Install Backend Dependencies**

    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Configuration**:
    Create a `.env` file in the `backend/` directory:

    ```env
    PORT=5000
    MONGO_URI=<Your Mongodb url connection link>
    JWT_SECRET=your_super_secret_key_123

    # YouTube API Configuration
    YOUTUBE_API_KEY=your_youtube_api_key
    YOUTUBE_PLAYLIST_ID=your_youtube_playlist_id
    ```

2.  **Frontend Configuration**:
    (If applicable) Create a `.env` file in `frontend/`:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### Running the App

1.  **Start the Backend Server**

    ```bash
    # In /backend terminal
    npm start
    ```

2.  **Start the Frontend Client**

    ```bash
    # In /frontend terminal
    npm run dev
    ```

3.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
