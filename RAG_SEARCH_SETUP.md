# RAG Search Implementation Guide

## What was implemented

✅ Complete RAG (Retrieval-Augmented Generation) search system using **Google Gemini API**

### Backend Components Created:

1. **Search Service** (`Backend/src/services/search.service.js`)
   - Semantic search using Gemini embeddings
   - Keyword-based search (fallback)
   - Hybrid search (combines both)
   - Cosine similarity scoring

2. **Search Controller** (`Backend/src/controllers/search.controller.js`)
   - Three API endpoints for different search types
   - Request validation and error handling

3. **Search Routes** (`Backend/src/routes/search.routes.js`)
   - POST `/api/v1/search/semantic` - Semantic search with embeddings
   - POST `/api/v1/search/keyword` - Fast keyword search
   - POST `/api/v1/search/hybrid` - Recommended: combined approach

### Frontend Components Created:

1. **SearchBar Component** (`Frontend/src/components/common/SearchBar.jsx`)
   - Updated with API integration
   - Uses hybrid search by default
   - Navigates to search results page

2. **SearchResults Page** (`Frontend/src/pages/SearchResults.jsx`)
   - Displays search results
   - Shows search type and result count
   - Beautiful UI with animations

3. **Routes Updated** (`Frontend/src/main.jsx`)
   - Added `/search-results` route

---

## Setup Instructions

### Step 1: Add Gemini API Key to Backend

1. Go to **Google AI Studio**: https://aistudio.google.com/
2. Click "Get API Key" → Create new API key
3. Copy your API key
4. Open `/home/devansh/My Youtube/Backend/.env`
5. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 2: Start Backend Server

```bash
cd /home/devansh/My\ Youtube/Backend
npm run dev
```

You should see:
```
Server is running on port 8000
```

### Step 3: Start Frontend Server

```bash
cd /home/devansh/My\ Youtube/Frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

---

## Testing the Search

### Option 1: Using Postman (Recommended for backend testing)

1. **Open Postman** and create a new request
2. **Method**: POST
3. **URL**: `http://localhost:8000/api/v1/search/hybrid`
4. **Headers**:
   ```
   Content-Type: application/json
   ```
5. **Body (raw JSON)**:
   ```json
   {
     "query": "tutorial",
     "limit": 10
   }
   ```
6. **Click Send**

Expected Response:
```json
{
  "statusCode": 200,
  "data": {
    "results": [
      {
        "_id": "...",
        "title": "Video Title",
        "discription": "Description",
        "thumbnail": "...",
        "views": 100,
        "owner": {
          "_id": "...",
          "username": "...",
          "avatar": "..."
        }
      }
    ],
    "count": 1,
    "searchType": "hybrid"
  },
  "message": "Hybrid search successful",
  "success": true
}
```

### Option 2: Using the Frontend UI

1. Open http://localhost:5173 in your browser
2. You should see a **Search Bar** (if integrated in Navbar)
3. Type a video title or topic
4. Click **Search** or press Enter
5. View results on the **SearchResults** page

---

## Search Types Explained

### 1. **Semantic Search** (`/search/semantic`)
- Uses Gemini to convert text to embeddings
- Compares embeddings to find conceptually similar videos
- **Best for**: Understanding meaning, synonyms, related topics
- **Slower**: Generates embedding for each video

### 2. **Keyword Search** (`/search/keyword`)
- Simple regex pattern matching on title & description
- **Best for**: Fast, exact matches
- **Fastest**: No embeddings needed

### 3. **Hybrid Search** (`/search/hybrid`) ⭐ **RECOMMENDED**
- Starts with keyword search to filter results
- Ranks filtered results using semantic similarity
- **Best of both worlds**: Fast + Accurate
- **Currently used** in SearchBar component

---

## File Structure

```
Backend/
├── src/
│   ├── services/
│   │   └── search.service.js          (NEW - RAG logic)
│   ├── controllers/
│   │   └── search.controller.js       (NEW - API handlers)
│   ├── routes/
│   │   └── search.routes.js           (NEW - API routes)
│   └── app.js                          (UPDATED - added search routes)
│
Frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       └── SearchBar.jsx          (UPDATED - API integration)
│   ├── pages/
│   │   └── SearchResults.jsx          (NEW)
│   │   └── SearchResults.css          (NEW)
│   └── main.jsx                        (UPDATED - added route)
│
Backend/.env                            (UPDATED - added GEMINI_API_KEY)
```

---

## Environment Variables (.env)

```env
# Existing variables...
PORT=8000
MONGODB_URI=...
CORS_ORIGIN=...

# NEW - Required for RAG Search
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Body |
|--------|----------|---------|------|
| POST | `/api/v1/search/semantic` | Semantic search with embeddings | `{"query": "text", "limit": 10}` |
| POST | `/api/v1/search/keyword` | Fast keyword search | `{"query": "text", "limit": 10}` |
| POST | `/api/v1/search/hybrid` | Combined search (recommended) | `{"query": "text", "limit": 10}` |

---

## Troubleshooting

### ❌ "GEMINI_API_KEY is not defined"
- Solution: Add your API key to `.env` file in Backend folder

### ❌ "Search failed" in frontend
- Check if backend server is running on port 8000
- Open browser console (F12) to see error details
- Verify CORS_ORIGIN in .env matches frontend URL

### ❌ "No videos found"
- Make sure videos exist in database
- Check if videos have `isPublished: true`
- Try keyword search instead of semantic

### ❌ Slow search response
- First search might be slower (generating embeddings)
- Subsequent searches are cached by the API
- Use hybrid search for better performance

---

## Next Steps (Optional Enhancements)

1. **Cache Embeddings**: Store video embeddings in database for faster searches
2. **Vector Database**: Use Pinecone/Weaviate for production-scale semantic search
3. **Transcript Search**: Add video transcript searching
4. **Advanced Filters**: Filter by date, views, channel
5. **Search History**: Save user search history

---

## Support

For issues or questions:
1. Check the error message in browser console or terminal
2. Verify API key is correct
3. Ensure both servers are running
4. Check if videos exist in database with proper fields

---

**Happy Searching! 🚀**
