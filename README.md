# Websocket SecureChat

A real-time, secure chat application built with modern web technologies. This project features a WebSocket-based backend for instant messaging and a polished, responsive React frontend.

## 🚀 Features

-   **Real-time Messaging**: Instant message delivery using WebSockets.
-   **Room-based Chat**: Users can create or join specific rooms to chat privately with others.
-   **Live User Count**: See how many users are currently in the room.
-   **Modern UI**: A sleek, dark-themed interface built with Tailwind CSS.
-   **Smooth Animations**: Enhanced user experience with Framer Motion transitions.
-   **Type-Safe**: Built entirely with TypeScript for better code quality and maintainability.

## 🛠️ Tech Stack

### Frontend
-   **React** (v19)
-   **TypeScript**
-   **Vite** - Fast build tool and dev server
-   **Tailwind CSS** (v4) - Utility-first CSS framework
-   **Framer Motion** - For animations
-   **Lucide React** - For icons

### Backend
-   **Node.js**
-   **TypeScript**
-   **ws** - Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js

## 📦 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **npm** (comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shivamsinghmer/Websocket-SecureChat.git
    cd Websocket-SecureChat
    ```

2.  **Backend Setup**
    Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```

3.  **Frontend Setup**
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers.

### 1. Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

The backend server will start on port `8080` (ws://localhost:8080).
> You should see: `WebSocket Server running on port 8080`

### 2. Start the Frontend Development Server

Open a new terminal, navigate to the `frontend` directory, and run:

```bash
npm run dev
```

The frontend will start (usually on `http://localhost:5173`). Open this URL in your browser.

> **Note**: If you are running locally without SSL/HTTPS, ensure your frontend connects via `ws://` instead of `wss://`.

## ⚙️ Configuration

### Backend
-   `PORT`: The port the WebSocket server listens on (default: `8080`).

### Frontend
-   `VITE_BACKEND_URL`: The URL of the WebSocket server.
    -   **Default**: `wss://localhost:8080` (configured in code).
    -   **Local Development**: Create a `.env` file in the `frontend` directory and add `VITE_BACKEND_URL=ws://localhost:8080` if connection fails with `wss://`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
