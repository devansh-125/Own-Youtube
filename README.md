# 🎬 YouTube Clone with Semantic Search

A full-featured YouTube clone I built with modern web technologies, featuring **semantic search** powered by local AI embeddings. No external API calls required - everything runs locally!

## ✨ Features

### Core Features
- **📹 Video Upload & Streaming** - Upload videos with automatic thumbnail generation via FFmpeg
- **🔍 Semantic Search** - AI-powered search that understands meaning, not just keywords
- **📱 Shorts Support** - Vertical video format (9:16) like TikTok/YouTube Shorts with swipe navigation
- **💬 Comments System** - Full CRUD operations with nested replies
- **👍 Like/Dislike** - Interactive engagement features
- **👤 User Profiles** - Channel management and customization
- **🎯 Smart Recommendations** - "Up Next" suggestions based on content
- **📊 Analytics** - View counts and engagement tracking
- **🔐 Authentication** - Secure JWT-based user system with Google OAuth
- **📱 Responsive Design** - Works on desktop and mobile

### Recent Additions
- **📜 Watch History** - Automatic tracking of watched videos and shorts
- **❤️ Liked Videos** - Save favorite videos to a dedicated collection
- **📺 Subscriptions** - Follow channels and view all subscriptions in one page
- **🎬 Shorts History** - Track watched short videos separately from long videos
- **🖼️ Auto Thumbnail Generation** - Extract frames from videos using FFmpeg
- **🌓 Dark/Light Theme** - Toggle between dark and light mode
- **🔄 Hybrid Search** - Combine semantic + keyword search for best results

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **React Router v6** - Client-side routing with dynamic parameters
- **CSS3** - Custom styling with CSS variables for theming
- **Axios** - Promise-based HTTP client
- **Vite** - Next-gen frontend build tool (3x faster than Webpack)
- **Context API** - Global state management (Authentication, Search, Theme)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Minimal web framework
- **MongoDB** - NoSQL database with aggregation pipelines
- **Mongoose** - ODM with schema validation
- **JWT** - Stateless authentication with refresh tokens
- **Multer** - Multipart form data handling
- **Xenova Transformers** - Local AI embeddings (no API required!)
- **Cloudinary** - Cloud video hosting and storage
- **FFmpeg** - Video frame extraction and thumbnail generation
- **Nodemon** - Development auto-reload

### AI/ML
- **Xenova Transformers** - Local sentence embeddings (all-MiniLM-L6-v2)
- **all-MiniLM-L6-v2** - 384-dimensional embedding model
- **Cosine Similarity** - Vector-based similarity calculation
- **Hybrid Ranking** - Semantic search + keyword boosting

### Infrastructure
- **Cloudinary** - Video and image CDN storage
- **MongoDB Atlas** - Cloud database
- **Google OAuth 2.0** - Social authentication

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/devansh-125/Own-Youtube.git
cd Own-Youtube

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

# Return to root
cd ..
```

### Environment Setup

Create `.env` files in both Backend and Frontend directories:

**Backend/.env:**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend/.env:**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas for cloud database
```

### Generate Embeddings (Optional)

If you have existing videos without embeddings:

```bash
cd Backend
node generateExistingVideoEmbeddings.js
node generateExistingShortsEmbeddings.js
```

### Generate Shorts Thumbnails

Extract frames from shorts videos and generate thumbnails:

```bash
cd Backend
node generateExistingShortsThumbails.js
```

## 🎯 Usage

### Development

```bash
# Start backend server
cd Backend
npm run dev

# Start frontend (in new terminal)
cd Frontend
npm run dev
```

Visit `http://localhost:5173` to access the application!

### Production Build

```bash
# Build frontend
cd Frontend
npm run build

# Start backend
cd ../Backend
npm start
```

## 🔍 Search Features

### Semantic Search
- **Powered by:** Local Xenova Transformers (no API costs!)
- **Model:** `all-MiniLM-L6-v2` (384-dimensional embeddings)
- **Algorithm:** Cosine similarity + keyword boosting
- **Speed:** < 2 seconds per search
- **Accuracy:** Understands meaning and context

### Search Examples

| Query | Results | Why it works |
|-------|---------|--------------|
| "life with bahi" | College Life Unfiltered (#1), Gpl Mohit bhaiii (#4) | Semantic understanding + keyword matching |
| "birthday" | Birthday videos ranked by relevance | Exact keyword + semantic similarity |
| "birrthhday" | Same birthday videos (typo tolerant) | Semantic search ignores spelling |

## 🎯 Key Features Explained

### 📜 Watch History
- **Automatic Tracking:** Every video/short you watch is recorded
- **Separate Sections:** Videos and shorts displayed in separate sections
- **Persistent Storage:** History saved to MongoDB
- **Easy Access:** Dedicated History page in sidebar

### ❤️ Liked Videos
- **Save Favorites:** Like videos to create a personalized collection
- **Like Counter:** Real-time like count updates
- **Quick Access:** Dedicated "Liked Videos" page
- **Like Management:** Unlike videos to remove from collection

### 📺 Subscriptions
- **Follow Channels:** Subscribe to any creator's channel
- **Subscription List:** View all subscribed channels in one page
- **Channel Info:** See subscriber counts and channel descriptions
- **Direct Navigation:** Click to visit channel profiles

### 📱 Shorts
- **Vertical Format:** 9:16 aspect ratio optimized for mobile
- **Swipe Navigation:** Swipe up/down or use arrow keys to browse
- **Auto-Play:** Videos play automatically when visible
- **Full Controls:** Mute, like, comment, share while watching
- **Keyboard Support:** Arrow keys for navigation, Space to play/pause
- **Touch Gestures:** Two-finger swipe support for mobile
- **History Tracking:** Shorts automatically added to watch history

### 🎬 Home Page Layout
- **Featured Videos:** Top 3 long-form videos in grid
- **Shorts Section:** Horizontal scroll carousel with 260px width cards
- **Remaining Videos:** Additional videos in responsive grid
- **Smooth Spacing:** Optimized gaps between sections

### 🔍 Search System

#### Semantic Search
- Understands meaning and context
- Tolerant to typos and variations
- Uses AI embeddings for deep matching
- Best for conceptual searches

#### Keyword Search  
- Exact word matching
- Fast and precise
- Good for specific titles

#### Hybrid Search
- Combines semantic + keyword approaches
- Recommended default
- Best overall results

### API Endpoints

#### Search Endpoints
```bash
# Semantic search (meaning-based)
POST /api/v1/search/semantic
{
  "query": "dance tutorial",
  "limit": 10
}

# Keyword search (exact matches)
POST /api/v1/search/keyword
{
  "query": "dance",
  "limit": 10
}

# Hybrid search (recommended - semantic + keywords)
POST /api/v1/search/hybrid
{
  "query": "life with bahi",
  "limit": 10
}
```

#### Video Management
```bash
GET    /api/v1/videos          # Get all videos (paginated)
GET    /api/v1/videos/:id      # Get video by ID
POST   /api/v1/videos          # Upload video (multipart/form-data)
PATCH  /api/v1/videos/:id      # Update video metadata
DELETE /api/v1/videos/:id      # Delete video
```

#### User Management & Auth
```bash
POST   /api/v1/users/register           # Create new account
POST   /api/v1/users/login              # Login with email/password
POST   /api/v1/users/refresh-token      # Get new access token
GET    /api/v1/users/profile            # Get current user profile
PATCH  /api/v1/users/profile            # Update user profile
POST   /api/v1/users/history/:videoId   # Add video to watch history
GET    /api/v1/users/history            # Get watch history
```

#### Social Features
```bash
POST   /api/v1/subscriptions/c/:channelId     # Subscribe to channel
GET    /api/v1/subscriptions/u/:subscriberId # Get subscribed channels
DELETE /api/v1/subscriptions/c/:channelId    # Unsubscribe

POST   /api/v1/likes/toggle/v/:videoId       # Toggle like on video
GET    /api/v1/likes/v/:videoId              # Get likes count

POST   /api/v1/comments/:videoId             # Add comment
GET    /api/v1/comments/:videoId             # Get comments (threaded)
PATCH  /api/v1/comments/:commentId           # Edit comment
DELETE /api/v1/comments/:commentId           # Delete comment
```

## 🏗️ Architecture

```
Frontend (React + Vite)
├── Components
│   ├── SearchBar.jsx          # Semantic search interface
│   ├── VideoCard.jsx          # Video display component
│   ├── ShortsCard.jsx         # Short video card (horizontal scroll)
│   ├── CommentSection.jsx     # Interactive comments with replies
│   ├── LikeButton.jsx         # Like/dislike toggle
│   ├── SubscribeButton.jsx    # Subscribe to channel
│   └── UploadForm.jsx         # Video upload with metadata
├── Pages
│   ├── Home.jsx              # Main feed with shorts + long videos
│   ├── VideoDetail.jsx       # Video player with responsive sizing
│   ├── Shorts.jsx            # Vertical video swiping (9:16 aspect)
│   ├── SearchResults.jsx     # Semantic + keyword search results
│   ├── History.jsx           # Watch history (videos + shorts)
│   ├── LikedVideos.jsx       # Favorite videos collection
│   ├── Subscriptions.jsx     # All subscribed channels list
│   ├── Profile.jsx           # User profile & channel management
│   ├── Login.jsx             # JWT + Google OAuth
│   ├── Signup.jsx            # User registration
│   └── UploadVideo.jsx       # Video/short upload interface
├── Layouts
│   ├── Navbar.jsx            # Top navigation with search
│   ├── Sidebar.jsx           # Left navigation (collapsible)
│   └── Footer.jsx            # Bottom footer
├── Context
│   ├── AuthContext.jsx       # Auth state & user info
│   ├── SearchContext.jsx     # Search queries & results
│   └── ThemeContext.jsx      # Dark/light mode
├── Services
│   └── api.js                # Axios instance with auth headers
└── Hooks
    └── useOnClickOutside.js  # Custom hook for dropdowns

Backend (Node.js + Express)
├── Controllers
│   ├── search.controller.js   # Semantic/keyword search
│   ├── video.controller.js    # Video CRUD + embedding generation
│   ├── user.controller.js     # Auth + user management
│   ├── comment.controller.js  # Comments CRUD
│   ├── like.controller.js     # Like/dislike toggle
│   ├── subscription.controller.js  # Channel subscriptions
│   └── playlist.controller.js # Playlist management
├── Services
│   └── search.service.js      # Core: Xenova embeddings + similarity
├── Models
│   ├── Video.js              # {title, desc, url, embedding[], views}
│   ├── User.js               # {profile, tokens, history[]}
│   ├── Comment.js            # Nested comments
│   ├── Subscription.js       # {subscriber, channel}
│   ├── Like.js               # {user, video, type}
│   └── Playlist.js           # User playlists
├── Routes
│   ├── search.routes.js      # /search/* endpoints
│   ├── video.routes.js       # /videos/* endpoints
│   ├── user.routes.js        # /users/* endpoints
│   ├── comment.routes.js     # /comments/* endpoints
│   ├── subscription.routes.js # /subscriptions/* endpoints
│   └── like.routes.js        # /likes/* endpoints
├── Middleware
│   ├── auth.middleware.js    # JWT verification
│   ├── verifyAuth.middleware.js  # Protected route wrapper
│   └── multer.middleware.js  # File upload handling
├── Utils
│   ├── cloudinary.js         # Video/image upload to CDN
│   ├── generateThumbnail.js  # FFmpeg frame extraction
│   ├── ApiError.js           # Error response class
│   ├── ApiResponse.js        # Success response class
│   └── asyncHandler.js       # Express error wrapper
└── Config
    └── passport.js           # Google OAuth strategy

Database (MongoDB)
├── Videos Collection
│   ├── title, description, videoFile (Cloudinary URL)
│   ├── thumbnail (Cloudinary URL)
│   ├── embedding: Float32Array[384]  # Xenova vector
│   ├── owner: ObjectId (ref: User)
│   ├── views, likes[], dislikes[], comments[]
│   ├── isShort: boolean
│   └── isPublished: boolean
├── Users Collection
│   ├── username, email, fullName, avatar, coverImage
│   ├── watchHistory: ObjectId[] (ref: Video)
│   ├── password (hashed with bcrypt)
│   ├── refreshToken
│   └── googleId (OAuth)
├── Comments Collection
│   ├── content, author (ref: User)
│   ├── video (ref: Video)
│   ├── replies: ObjectId[] (nested)
│   └── timestamps
├── Subscriptions Collection
│   ├── subscriber (ref: User)
│   └── channel (ref: User)
└── Likes Collection
    ├── user (ref: User)
    ├── video (ref: Video)
    └── type: 'like' | 'dislike'
```

## 🤖 AI/ML Implementation

### How Semantic Search Works

**Step 1: Video Upload**
```
User uploads video with title + description
                    ↓
            Extract text content
                    ↓
      Generate embedding using Xenova
         (384-dimensional vector)
                    ↓
           Store in MongoDB
         (alongside video metadata)
```

**Step 2: Search Query**
```
User enters search query
         ↓
Convert query to embedding (same model)
         ↓
Calculate cosine similarity with all videos
         ↓
Apply keyword boosting for relevance
         ↓
Sort by combined score
         ↓
Return top N results
```

### Key Advantages

| Aspect | Benefit |
|--------|---------|
| **Cost** | $0 - Runs completely locally |
| **Speed** | < 2 seconds per search (no network latency) |
| **Privacy** | No data sent to external APIs |
| **Scalability** | Unlimited videos, no rate limits |
| **Accuracy** | Understands semantic meaning, not just keywords |
| **Reliability** | Works offline, no external dependencies |

### Technical Details

- **Model:** `all-MiniLM-L6-v2` from Hugging Face
- **Embedding Dimension:** 384
- **Similarity Metric:** Cosine similarity (0-1 scale)
- **Processing Library:** Xenova Transformers (ONNX runtime)
- **Boost Formula:** `similarity_score * keyword_multiplier`
- **Indexing:** MongoDB text indexes for keyword search

## 📊 Performance

| Feature | Performance | Notes |
|---------|-------------|-------|
| Video Upload | < 5 seconds | Includes embedding generation |
| Search Query | < 2 seconds | Local processing only |
| Video Streaming | Instant | Cloudinary CDN |
| Database Queries | < 100ms | Optimized with indexes |
| Embedding Generation | < 1 second | Local Xenova processing |

## 🔧 Development Scripts

```bash
# Backend
npm run dev          # Start development server
npm start           # Start production server
npm test           # Run tests

# Frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🤝 Contributing

I welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Xenova Transformers** - For providing local AI models
- **React Community** - For amazing UI framework
- **MongoDB** - For flexible NoSQL database
- **YouTube** - For inspiration and design patterns

## 📞 Contact

- **GitHub:** [devansh-125](https://github.com/devansh-125)
- **LinkedIn:** [Devansh Chaudhary](https://www.linkedin.com/in/devansh-chaudhary-26ba73311/)
- **Email:** cdevansh913@gmail.com

---

**Built with ❤️ using modern web technologies and local AI** 🚀

*Star this repo if you found it helpful!* ⭐