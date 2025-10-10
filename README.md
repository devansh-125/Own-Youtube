# 🎬 Own-Youtube

A **feature-rich full-stack YouTube clone** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
This project includes **dual authentication (JWT + Google OAuth)**, **video management**, **interactive features**, and a **modern responsive UI** — offering a near real YouTube-like experience.

---

## ✨ Features

### 🔐 Authentication
* **JWT Authentication**: Secure user registration and login with JSON Web Tokens.
* **Google OAuth 2.0**: Social login for seamless and secure access.
* Unified middleware to protect routes using both authentication methods.

### 🎥 Video Management
* Upload videos with custom titles, descriptions, and thumbnails.
* Videos and thumbnails are stored on **Cloudinary** for scalable media handling.
* Users can view, edit, and delete their own videos.

### 💬 Interactivity
* **Like/Dislike System**: Users can like/unlike videos and comments.
* **Comments Section**: Fully functional comment system under each video.
* **Emoji Picker**: Add emojis to comments or video descriptions for a richer experience.

### 👤 User Profiles & Channels
* Each user has a public **channel page** with an avatar and cover image.
* Displays channel information and uploaded videos in a grid format.

### 🧭 Responsive UI
* Built with **React.js** and optimized for all screen sizes (desktop, tablet, mobile).
* Includes a **persistent sidebar**, **dynamic video grid**, and clean modern layout.

### 🔒 Backend Security
* User passwords are hashed using **bcrypt**.
* File uploads handled securely using **Multer** middleware.
* Data validated and sanitized to prevent injection or misuse.

---

## 🛠️ Technology Stack

### ⚙️ Backend
* **[Node.js](https://nodejs.org/)** – JavaScript runtime environment.
* **[Express.js](https://expressjs.com/)** – Web framework for Node.js.
* **[MongoDB](https://www.mongodb.com/)** – NoSQL database for storing user and video data.
* **[Mongoose](https://mongoosejs.com/)** – ODM library for MongoDB.
* **[JWT](https://jwt.io/)** – JSON Web Tokens for secure authentication.
* **[Passport.js](http://www.passportjs.org/)** – Used for Google OAuth 2.0 authentication.
* **[Bcrypt](https://www.npmjs.com/package/bcrypt)** – Library for hashing passwords.
* **[Multer](https://github.com/expressjs/multer)** – Handles file uploads.
* **[Cloudinary](https://cloudinary.com/)** – Cloud platform for video and image management.

### 💻 Frontend
* **[React.js](https://reactjs.org/)** – Library for building UI components.
* **[React Router](https://reactrouter.com/)** – For client-side routing.
* **[Axios](https://axios-http.com/)** – Promise-based HTTP client.
* **[Emoji Picker React](https://github.com/ealush/emoji-picker-react)** – For emoji selection in forms.
* *(Optional)* You can integrate **Tailwind CSS** or **Redux** for advanced state and style management.

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 📋 Prerequisites

You’ll need:
* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* A **MongoDB** database (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free cloud storage)
* A **Cloudinary account** for video/image hosting
* A **Google Cloud Project** for OAuth credentials

---

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/devansh-125/Own-Youtube.git](https://github.com/devansh-125/Own-Youtube.git)
    cd Own-Youtube
    ```

2.  **Setup the Backend:**
    ```bash
    cd Backend
    npm install
    ```
    Create a `.env` file in the `Backend` directory and add the following environment variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=http://localhost:5173

   # Tokens and Secrets
   ACCESS_TOKEN_SECRET=your_super_secret_access_token
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
   SESSION_SECRET=your_long_random_session_secret_string

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Google OAuth 2.0 Credentials
   GOOGLE_CLIENT_ID=your_google_client_id_from_gcp
   GOOGLE_CLIENT_SECRET=your_google_client_secret_from_gcp
   GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../Frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the Backend directory
    npm run dev
    ```

2.  **Start the Frontend Development Server:**![alt text](image.png)
    ```bash
    # From the Frontend directory
    npm run dev
    ```

Your application should now be running, with the frontend available at `http://localhost:5173` (or another port specified by Vite/React) and the backend server at `http://localhost:8000`.