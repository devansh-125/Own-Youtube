# 🎬 YouTube Clone with Semantic Search

A full-featured YouTube clone I built with modern web technologies, featuring **semantic search** powered by local AI embeddings. No external API calls required - everything runs locally!

## ✨ Features

- **📹 Video Upload & Streaming** - Upload videos with automatic thumbnail generation
- **🔍 Semantic Search** - AI-powered search that understands meaning, not just keywords
- **📱 Shorts Support** - Vertical video format like TikTok/YouTube Shorts
- **💬 Comments System** - Full CRUD operations with nested replies
- **👍 Like/Dislike** - Interactive engagement features
- **👤 User Profiles** - Channel management and customization
- **🎯 Smart Recommendations** - "Up Next" suggestions based on content
- **📊 Analytics** - View counts and engagement tracking
- **🔐 Authentication** - Secure JWT-based user system
- **📱 Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **CSS** - Custom styling (no Tailwind CSS)
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **Xenova Transformers** - Local AI embeddings (no API required!)

### AI/ML
- **Xenova Transformers** - Local sentence embeddings
- **all-MiniLM-L6-v2** - 384-dimensional embeddings
- **Cosine Similarity** - Vector comparison algorithm
- **Hybrid Ranking** - Semantic + keyword search

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
GET    /api/v1/videos          # Get all videos
GET    /api/v1/videos/:id      # Get video by ID
POST   /api/v1/videos           # Upload video
PATCH  /api/v1/videos/:id       # Update video
DELETE /api/v1/videos/:id       # Delete video
```

#### User Management
```bash
POST   /api/v1/users/register   # Register user
POST   /api/v1/users/login      # Login user
GET    /api/v1/users/profile    # Get user profile
PATCH  /api/v1/users/profile    # Update profile
```

#### Social Features
```bash
POST   /api/v1/subscriptions/c/:channelId  # Subscribe
POST   /api/v1/likes/toggle/v/:videoId     # Like video
POST   /api/v1/comments/:videoId           # Add comment
GET    /api/v1/comments/:videoId           # Get comments
```

## 🏗️ Architecture

```
Frontend (React + Vite)
├── Components
│   ├── SearchBar.jsx          # Semantic search interface
│   ├── VideoCard.jsx          # Video display component
│   ├── CommentSection.jsx     # Interactive comments
│   └── UploadForm.jsx         # Video upload with embedding generation
├── Pages
│   ├── Home.jsx              # Main feed with search results
│   ├── VideoDetail.jsx       # Video player page
│   ├── Shorts.jsx            # Vertical video format
│   ├── SearchResults.jsx     # Search results display
│   └── Profile.jsx           # User profile management
└── Context
    └── SearchContext.jsx     # Global search state management

Backend (Node.js + Express)
├── Controllers
│   ├── search.controller.js   # Search API handlers
│   ├── video.controller.js    # Video CRUD + embedding generation
│   ├── user.controller.js     # User management
│   └── comment.controller.js  # Comment system
├── Services
│   └── search.service.js      # Core search logic (Xenova + similarity)
├── Models
│   ├── Video.js              # Video schema with embedding field
│   ├── User.js               # User schema
│   └── Comment.js            # Comment schema
├── Routes
│   ├── search.routes.js      # Search endpoints
│   ├── video.routes.js       # Video endpoints
│   └── user.routes.js        # User endpoints
└── Middleware
    ├── auth.middleware.js    # JWT authentication
    └── upload.middleware.js  # File upload handling

Database (MongoDB)
├── Videos Collection
│   ├── title, description, url
│   ├── embedding: [384 numbers]  # Xenova-generated vector
│   └── metadata (views, likes, etc.)
├── Users Collection
│   └── profile data + authentication
└── Comments Collection
    └── nested comment threads
```

## 🤖 AI/ML Implementation

### How Semantic Search Works

1. **Video Upload:**
   - Extract title + description
   - Generate 384-dim embedding using Xenova locally
   - Store vector in MongoDB

2. **User Search:**
   - Convert query to embedding (same model)
   - Calculate cosine similarity with all videos
   - Apply keyword boosting for relevance
   - Return sorted results

### Key Advantages

- **Cost:** $0 (no API calls, runs locally)
- **Speed:** < 2 seconds per search
- **Privacy:** No data sent to external services
- **Scalability:** Unlimited videos, no rate limits
- **Accuracy:** Understands context and meaning

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