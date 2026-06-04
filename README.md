# IslingConnect

IslingConnect is a comprehensive platform developed as a Final Year Project (FYP). It features a robust Node.js/Express backend, a modern React web interface for administration, and a cross-platform React Native mobile application.

## 🚀 Features

- **Mobile App**: Built with React Native and Expo, offering a seamless experience for users on both iOS and Android platforms. Features include real-time interactions, secure authentication, and seamless scheduling.
- **Admin Interface**: A powerful, responsive web dashboard built with React, Vite, and Tailwind CSS. It allows administrators to manage users, oversee the platform, and control application data efficiently.
- **Backend Services**: A scalable Node.js backend using Express and MongoDB (via Mongoose). It handles authentication (JWT, bcrypt), real-time communication (Socket.io), email notifications (Nodemailer), and PDF generation (PDFKit).

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Authentication**: JWT, bcryptjs
- **Utilities**: Multer (file uploads), Nodemailer (emails), PDFKit (document generation)

### Admin Interface (Web)
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Mobile App (IslingApp)
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack, Bottom Tabs)
- **Storage**: AsyncStorage
- **Real-time**: Socket.io-client
- **UI Components**: Native Expo components, DateTime picker

## 📂 Project Structure

```text
IslingConnect/
├── Admin-Interface/     # React + Vite web dashboard for administrators
├── Backend/             # Node.js + Express API and Socket server
├── IslingApp/           # React Native Expo mobile application
└── README.md            # Project documentation
```

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local or Atlas cluster)
- Expo Go app on your mobile device (for testing the app)

### 1. Installation

**Backend Setup**
Navigate to the backend directory, install dependencies, and configure environment variables.
```bash
cd Backend
npm install
```
*Note: Create a `.env` file in the `Backend` directory containing required keys like `PORT`, `MONGO_URI`, and `JWT_SECRET`.*

To start the backend server:
```bash
npm run dev
```

**Admin Interface Setup**
Open a new terminal window:
```bash
cd Admin-Interface
npm install
npm run dev
```
This will start the Vite development server (usually on `http://localhost:5173`).

**Mobile App Setup**
Open a third terminal window:
```bash
cd IslingApp
npm install
npm start
```
Scan the QR code generated in the terminal using the Expo Go app on your iOS or Android device.

## 📜 Scripts Overview

- **Backend**: `npm run dev` (starts the server with nodemon for live reloading).
- **Admin-Interface**: `npm run dev` (starts Vite), `npm run build` (builds for production).
- **IslingApp**: `npm start` (starts Expo bundler).

## 👤 Author
**Aryan Bhandary**
- Student ID: 23049044
- Project: Final Year Project (FYP)
