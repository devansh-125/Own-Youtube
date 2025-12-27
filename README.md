# 🎬 Own-Youtube# 🎬 Own-Youtube



A **feature-rich full-stack YouTube clone** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  A **feature-rich full-stack YouTube clone** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  

This project includes **dual authentication (JWT + Google OAuth)**, **RAG semantic search**, **professional Shorts feature**, **video management**, **interactive features**, and a **modern responsive UI** — offering a YouTube-like experience.This project includes **dual authentication (JWT + Google OAuth)**, **video management**, **interactive features**, and a **modern responsive UI** — offering a near real YouTube-like experience.



------



## ✨ Features## ✨ Features



### 🔐 Authentication### 🔐 Authentication

* **JWT Authentication**: Secure user registration and login with JSON Web Tokens.* **JWT Authentication**: Secure user registration and login with JSON Web Tokens.

* **Google OAuth 2.0**: Social login for seamless and secure access.* **Google OAuth 2.0**: Social login for seamless and secure access.

* Unified middleware to protect routes using both authentication methods.* Unified middleware to protect routes using both authentication methods.



### 🔍 RAG Semantic Search (NEW!)### 🎥 Video Management

* **AI-Powered Search**: Uses Google Gemini API to understand search intent* Upload videos with custom titles, descriptions, and thumbnails.

* **Three Search Types**:* Videos and thumbnails are stored on **Cloudinary** for scalable media handling.

  - 🟢 **Semantic Search**: Vector-based matching (understands meaning)* Users can view, edit, and delete their own videos.

  - 🔵 **Keyword Search**: Traditional text matching

  - 🟣 **Hybrid Search**: Combines both for best results### 💬 Interactivity

* **Auto-Indexing**: Videos automatically indexed with 768-dimensional embeddings on upload* **Like/Dislike System**: Users can like/unlike videos and comments.

* **Instant Results**: Sub-second search response times* **Comments Section**: Fully functional comment system under each video.

* **Smart Ranking**: Results ranked by relevance similarity* **Emoji Picker**: Add emojis to comments or video descriptions for a richer experience.



### 🎬 Shorts Feature (NEW!)### 👤 User Profiles & Channels

* **Professional Video Browsing**: Vertical video format like TikTok/Instagram Reels* Each user has a public **channel page** with an avatar and cover image.

* **4 Navigation Methods**:* Displays channel information and uploaded videos in a grid format.

  - 📱 **Swipe Navigation**: Swipe up/down (one or two fingers)

  - ⌨️ **Keyboard Navigation**: Arrow keys (↑↓) + Spacebar on desktop### 🧭 Responsive UI

  - 🖱️ **Click Navigation**: On-screen navigation buttons* Built with **React.js** and optimized for all screen sizes (desktop, tablet, mobile).

  - 🎮 **Multiple Interactions**: Like, Dislike, Subscribe, Share* Includes a **persistent sidebar**, **dynamic video grid**, and clean modern layout.

* **Smart Controls**:

  - Click to play/pause### 🔒 Backend Security

  - Spacebar for play/pause* User passwords are hashed using **bcrypt**.

  - Auto-play on navigation* File uploads handled securely using **Multer** middleware.

  - Visual feedback (colors, icons)* Data validated and sanitized to prevent injection or misuse.

* **Responsive Design**: Works on desktop, tablet, and mobile

---

### 🎥 Video Management

* Upload videos with custom titles, descriptions, and thumbnails.## 🛠️ Technology Stack

* Videos and thumbnails are stored on **Cloudinary** for scalable media handling.

* Users can view, edit, and delete their own videos.### ⚙️ Backend

* **Automatic Cleanup**: Temporary upload files auto-deleted on success or failure.* **[Node.js](https://nodejs.org/)** – JavaScript runtime environment.

* **[Express.js](https://expressjs.com/)** – Web framework for Node.js.

### 💬 Interactivity* **[MongoDB](https://www.mongodb.com/)** – NoSQL database for storing user and video data.

* **Like/Dislike System**: Users can like/unlike videos and comments.* **[Mongoose](https://mongoosejs.com/)** – ODM library for MongoDB.

* **Comments Section**: Fully functional comment system under each video.* **[JWT](https://jwt.io/)** – JSON Web Tokens for secure authentication.

* **Emoji Picker**: Add emojis to comments or video descriptions for a richer experience.* **[Passport.js](http://www.passportjs.org/)** – Used for Google OAuth 2.0 authentication.

* **Subscribe System**: Users can subscribe to channels and manage subscriptions.* **[Bcrypt](https://www.npmjs.com/package/bcrypt)** – Library for hashing passwords.

* **Share Functionality**: Native share dialog or copy link to clipboard.* **[Multer](https://github.com/expressjs/multer)** – Handles file uploads.

* **[Cloudinary](https://cloudinary.com/)** – Cloud platform for video and image management.

### 👤 User Profiles & Channels

* Each user has a public **channel page** with an avatar and cover image.### 💻 Frontend

* Displays channel information and uploaded videos in a grid format.* **[React.js](https://reactjs.org/)** – Library for building UI components.

* View subscription status and manage subscriptions.* **[React Router](https://reactrouter.com/)** – For client-side routing.

* **[Axios](https://axios-http.com/)** – Promise-based HTTP client.

### 🧭 Responsive UI* **[Emoji Picker React](https://github.com/ealush/emoji-picker-react)** – For emoji selection in forms.

* Built with **React.js** and optimized for all screen sizes (desktop, tablet, mobile).* *(Optional)* You can integrate **Tailwind CSS** or **Redux** for advanced state and style management.

* Includes a **persistent sidebar**, **dynamic video grid**, and clean modern layout.

* Professional Shorts player with full-screen video experience.---



### 🔒 Backend Security## 🚀 Getting Started

* User passwords are hashed using **bcrypt**.

* File uploads handled securely using **Multer** middleware.Follow these steps to set up the project locally on your machine.

* Data validated and sanitized to prevent injection or misuse.

* API keys protected in `.env` with `.gitignore` protection.### 📋 Prerequisites

* No secrets exposed in git history.

You’ll need:

---* **Node.js** (v18.x or higher)

* **npm** or **yarn**

## 🛠️ Technology Stack* A **MongoDB** database (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free cloud storage)

* A **Cloudinary account** for video/image hosting

### ⚙️ Backend* A **Google Cloud Project** for OAuth credentials

* **[Node.js](https://nodejs.org/)** – JavaScript runtime environment.

* **[Express.js](https://expressjs.com/)** – Web framework for Node.js.---

* **[MongoDB](https://www.mongodb.com/)** – NoSQL database for storing user and video data.

* **[Mongoose](https://mongoosejs.com/)** – ODM library for MongoDB.### Installation & Setup

* **[JWT](https://jwt.io/)** – JSON Web Tokens for secure authentication.

* **[Passport.js](http://www.passportjs.org/)** – Used for Google OAuth 2.0 authentication.1.  **Clone the repository:**

* **[Bcrypt](https://www.npmjs.com/package/bcrypt)** – Library for hashing passwords.    ```bash

* **[Multer](https://github.com/expressjs/multer)** – Handles file uploads.    git clone [https://github.com/devansh-125/Own-Youtube.git](https://github.com/devansh-125/Own-Youtube.git)

* **[Cloudinary](https://cloudinary.com/)** – Cloud platform for video and image management.    cd Own-Youtube

* **[Google Gemini API](https://ai.google.dev/)** – For AI-powered semantic search embeddings.    ```



### 💻 Frontend2.  **Setup the Backend:**

* **[React.js](https://reactjs.org/)** – Library for building UI components.    ```bash

* **[React Router](https://reactrouter.com/)** – For client-side routing.    cd Backend

* **[Axios](https://axios-http.com/)** – Promise-based HTTP client.    npm install

* **[Emoji Picker React](https://github.com/ealush/emoji-picker-react)** – For emoji selection in forms.    ```

* **[Vite](https://vitejs.dev/)** – Next generation frontend build tool.    Create a `.env` file in the `Backend` directory and add the following environment variables:

    ```env

---    PORT=8000

    MONGODB_URI=your_mongodb_connection_string

## 📚 Documentation    CORS_ORIGIN=http://localhost:5173



Detailed documentation is available in:    # Tokens and Secrets

    ACCESS_TOKEN_SECRET=your_super_secret_access_token

* **[RAG_IMPLEMENTATION.md](./RAG_IMPLEMENTATION.md)** - Complete RAG semantic search explanation, setup, and usage guide.    REFRESH_TOKEN_SECRET=your_super_secret_refresh_token

    SESSION_SECRET=your_long_random_session_secret_string

---

    # Cloudinary Credentials

## 🚀 Getting Started    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

    CLOUDINARY_API_KEY=your_cloudinary_api_key

Follow these steps to set up the project locally on your machine.    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

 

### 📋 Prerequisites    # Google OAuth 2.0 Credentials

    GOOGLE_CLIENT_ID=your_google_client_id_from_gcp

You'll need:    GOOGLE_CLIENT_SECRET=your_google_client_secret_from_gcp

* **Node.js** (v18.x or higher)    GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback

* **npm** or **yarn**    ```

* A **MongoDB** database (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free cloud storage)

* A **Cloudinary account** for video/image hosting3.  **Setup the Frontend:**

* A **Google Cloud Project** for:    ```bash

  - OAuth credentials (for social login)    cd ../Frontend

  - Gemini API key (for semantic search)    npm install

    ```

---

### Running the Application

### Installation & Setup

1.  **Start the Backend Server:**

1.  **Clone the repository:**    ```bash

    ```bash    # From the Backend directory

    git clone https://github.com/devansh-125/Own-Youtube.git    npm run dev

    cd Own-Youtube    ```

    ```

2.  **Start the Frontend Development Server:**![alt text](image.png)

2.  **Setup the Backend:**    ```bash

    ```bash    # From the Frontend directory

    cd Backend    npm run dev

    npm install    ```

    ```

    Create a `.env` file in the `Backend` directory and add the following environment variables:Your application should now be running, with the frontend available at `http://localhost:5173` (or another port specified by Vite/React) and the backend server at `http://localhost:8000`.

    ```env

    PORT=8000---

    MONGODB_URI=your_mongodb_connection_string

    CORS_ORIGIN=http://localhost:5173## 📚 Documentation



    # Tokens and SecretsThis project includes comprehensive documentation for different features:

    ACCESS_TOKEN_SECRET=your_super_secret_access_token

    REFRESH_TOKEN_SECRET=your_super_secret_refresh_token### 📖 Available Guides

    SESSION_SECRET=your_long_random_session_secret_string- **[RAG Implementation Guide](./RAG_IMPLEMENTATION.md)** - Semantic search with Gemini API and vector embeddings

- **[Shorts Features Guide](./SHORTS_FIXED.md)** - All Shorts video features (swipe, keyboard, like, share)

    # Cloudinary Credentials- **[Swipe Gesture Guide](./SWIPE_GESTURE_GUIDE.md)** - Detailed swipe navigation tutorial

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name- **[Quick Reference](./WHAT_YOU_HAVE.md)** - Quick summary of what's implemented

    CLOUDINARY_API_KEY=your_cloudinary_api_key

    CLOUDINARY_API_SECRET=your_cloudinary_api_secret### 🎥 Shorts Features

 The Shorts component includes multiple ways to navigate and interact:

    # Google OAuth 2.0 Credentials- **Swipe Navigation**: One or two-finger swipe (up for next, down for previous)

    GOOGLE_CLIENT_ID=your_google_client_id_from_gcp- **Keyboard Navigation**: Arrow keys for desktop, spacebar for play/pause

    GOOGLE_CLIENT_SECRET=your_google_client_secret_from_gcp- **Click Navigation**: On-screen arrow buttons

    GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback- **Interactions**: Like, dislike, subscribe, and share buttons

- **Auto-play**: Videos start playing automatically on navigation
    # Google Gemini API (For RAG Semantic Search)
    GEMINI_API_KEY=your_google_gemini_api_key
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

2.  **Start the Frontend Development Server:**
    ```bash
    # From the Frontend directory
    npm run dev
    ```

Your application should now be running:
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:8000`
* **Shorts**: `http://localhost:5173/shorts`

---

## 🎯 Key Features Explained

### RAG Semantic Search
Users can search for videos using natural language. The system understands meaning, not just keywords:
```
Search: "cooking videos"    → Returns cooking content
Search: "how to dance"      → Returns dance tutorials
Search: "motivational talk" → Returns motivational speeches
```

See [RAG_IMPLEMENTATION.md](./RAG_IMPLEMENTATION.md) for complete details.

### Shorts Feature
Browse videos like TikTok:
- **Swipe Up** → Next video
- **Swipe Down** → Previous video
- **Arrow Keys** → Navigate (desktop)
- **Spacebar** → Play/Pause
- **Like/Dislike/Subscribe/Share** → All fully functional

### Video Upload
When you upload a video:
1. ✅ Video uploaded to Cloudinary
2. ✅ Thumbnail handled (auto-generated or custom)
3. ✅ Video metadata saved to MongoDB
4. ✅ Embedding generated for semantic search
5. ✅ Temporary files auto-deleted
6. ✅ Ready for search and discovery

---

## 📁 Project Structure

```
Own-Youtube/
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (RAG search)
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── utils/            # Helper functions
│   │   ├── config/           # Configuration files
│   │   └── db/               # Database connection
│   ├── public/temp/          # Temporary upload files (auto-cleaned)
│   ├── .env                  # Environment variables
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API service
│   │   └── main.jsx
│   ├── public/               # Static assets
│   └── package.json
│
├── RAG_IMPLEMENTATION.md      # Detailed RAG search documentation
├── README.md                  # This file
└── .gitignore                 # Git ignore file
```

---

## 🔄 API Endpoints

### Search Endpoints
```
POST /api/v1/search/semantic    - Semantic search with vectors
POST /api/v1/search/keyword     - Keyword-based search
POST /api/v1/search/hybrid      - Combined semantic + keyword
```

### Video Endpoints
```
GET    /api/v1/videos           - Get all videos
POST   /api/v1/videos           - Upload new video
GET    /api/v1/videos/:id       - Get video by ID
PATCH  /api/v1/videos/:id       - Update video
DELETE /api/v1/videos/:id       - Delete video
```

### Interaction Endpoints
```
PATCH  /api/v1/likes/toggle/video/:videoId     - Toggle like
PATCH  /api/v1/likes/toggle/dislike/:videoId   - Toggle dislike
POST   /api/v1/subscriptions/c/:channelId      - Subscribe to channel
GET    /api/v1/subscriptions/status/:channelId - Check subscription status
```

---

## 🧪 Testing Features

### Test RAG Search
1. Upload a video with title "Python Tutorial"
2. Search for "coding" or "programming"
3. The video appears in results (semantic matching!)

### Test Shorts Navigation
1. Go to `/shorts`
2. Try all 4 navigation methods:
   - Swipe up/down
   - Arrow keys
   - Spacebar
   - Click buttons

### Test Video Upload
1. Go to upload page
2. Select video and thumbnail
3. Fill in title and description
4. Upload
5. Check backend logs for:
   - Embedding generation
   - Temp file cleanup
   - Success response

---

## 🔧 Troubleshooting

### Semantic Search Not Working
1. Verify `GEMINI_API_KEY` in `.env`
2. Check backend logs for API errors
3. Ensure videos have embeddings generated

### Shorts Not Loading
1. Verify backend is running on port 8000
2. Check MongoDB connection
3. Ensure videos exist with `isShort: true`

### Upload Failures
1. Check Cloudinary credentials
2. Verify file size limits
3. Check `/Backend/public/temp/` is writable

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Devansh** - [GitHub](https://github.com/devansh-125/Own-Youtube)

---

## 🙏 Acknowledgments

* Google Gemini API for semantic search capabilities
* Cloudinary for reliable video hosting
* MongoDB for flexible data storage
* Express.js and React.js communities

---

**Happy coding! 🚀**
