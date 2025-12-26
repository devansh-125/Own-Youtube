# 💻 RAG Search - Code Examples & Usage

## API Usage Examples

### 1. Hybrid Search (RECOMMENDED) - Balanced Performance

**Frontend Usage:**
```javascript
import API from './services/api';

// Make search request
const response = await API.post('/search/hybrid', {
  query: 'JavaScript tutorial',
  limit: 20
});

// Results are in: response.data.data.results
const videos = response.data.data.results;
```

**Postman Request:**
```
POST http://localhost:8000/api/v1/search/hybrid
Content-Type: application/json

{
  "query": "JavaScript tutorial",
  "limit": 20
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "results": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Learn JavaScript - Full Course",
        "discription": "Complete JavaScript tutorial for beginners",
        "thumbnail": "https://...",
        "videoFile": "https://...",
        "duration": 3600,
        "views": 50000,
        "owner": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "js_master",
          "avatar": "https://..."
        },
        "createdAt": "2024-12-01T10:00:00.000Z"
      }
      // ... 19 more results
    ],
    "count": 20,
    "searchType": "hybrid"
  },
  "message": "Hybrid search successful",
  "success": true
}
```

---

### 2. Semantic Search (Best Accuracy, Slower)

**When to use:** 
- Complex queries
- Conceptual searches
- Related topic discovery

**Frontend Usage:**
```javascript
// Search for conceptually related content
const response = await API.post('/search/semantic', {
  query: 'web development fundamentals',
  limit: 10
});
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/v1/search/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "query": "web development fundamentals",
    "limit": 10
  }'
```

---

### 3. Keyword Search (Fastest, Pattern Matching)

**When to use:**
- Exact matches needed
- Very fast results required
- Simple titles/descriptions

**Frontend Usage:**
```javascript
// Fast keyword-based search
const response = await API.post('/search/keyword', {
  query: 'react',
  limit: 15
});
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/search/keyword \
  -H "Content-Type: application/json" \
  -d '{
    "query": "react",
    "limit": 15
  }'
```

---

## Frontend Implementation Examples

### Using Search in a Component

```jsx
import { useState } from 'react';
import API from '../services/api';
import VideoCard from './VideoCard';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Use hybrid search (balanced)
      const response = await API.post('/search/hybrid', {
        query: query.trim(),
        limit: 20
      });

      setResults(response.data.data.results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <div className='results-grid'>
          {results.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p>No videos found for "{query}"</p>
      )}
    </div>
  );
}

export default SearchComponent;
```

---

### Handling Different Search Types

```jsx
import { useState } from 'react';
import API from '../services/api';

function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('hybrid');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      // Choose endpoint based on search type
      const endpoint =
        searchType === 'semantic'
          ? '/search/semantic'
          : searchType === 'keyword'
          ? '/search/keyword'
          : '/search/hybrid';

      const response = await API.post(endpoint, {
        query: query.trim(),
        limit: 20
      });

      setResults(response.data.data.results);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="search-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query..."
          onKeyPress={(e) => e.key === 'Enter' && performSearch()}
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="hybrid">Hybrid (Recommended)</option>
          <option value="semantic">Semantic (Accurate)</option>
          <option value="keyword">Keyword (Fast)</option>
        </select>

        <button onClick={performSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="search-info">
        Found {results.length} videos using {searchType} search
      </div>

      {/* Display results */}
    </div>
  );
}

export default AdvancedSearch;
```

---

## Backend Implementation Examples

### Service Method: Semantic Search

```javascript
// From search.service.js
async function semanticSearch(query, topK = 10) {
  try {
    // 1. Get all published videos
    const videos = await Video.find({ isPublished: true })
      .select("title discription thumbnail videoFile duration views owner createdAt")
      .populate("owner", "username avatar")
      .lean();

    // 2. Generate embedding for query using Gemini
    const queryEmbedding = await generateEmbedding(query);

    // 3. Generate embeddings for videos and calculate similarity
    const videosWithScores = await Promise.all(
      videos.map(async (video) => {
        const videoText = `${video.title} ${video.discription || ""}`;
        const videoEmbedding = await generateEmbedding(videoText);
        const similarityScore = cosineSimilarity(queryEmbedding, videoEmbedding);

        return {
          ...video,
          similarityScore
        };
      })
    );

    // 4. Sort and return top K
    return videosWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK)
      .map(({ similarityScore, ...video }) => video);
  } catch (error) {
    console.error("Error in semantic search:", error);
    throw error;
  }
}
```

### Service Method: Keyword Search

```javascript
async function keywordSearch(query, limit = 10) {
  try {
    const results = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { discription: { $regex: query, $options: "i" } }
      ],
      isPublished: true
    })
      .select("title discription thumbnail videoFile duration views owner createdAt")
      .populate("owner", "username avatar")
      .limit(limit)
      .lean();

    return results;
  } catch (error) {
    console.error("Error in keyword search:", error);
    throw error;
  }
}
```

### Controller: Handling Search Request

```javascript
// From search.controller.js
const performHybridSearch = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.body;

  // Validate input
  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  // Perform hybrid search
  const results = await hybridSearch(query, parseInt(limit));

  // Return formatted response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        count: results.length,
        searchType: "hybrid"
      },
      "Hybrid search successful"
    )
  );
});
```

---

## Error Handling Examples

### Handling Search Errors in Frontend

```javascript
async function searchVideos(query) {
  try {
    setLoading(true);
    
    const response = await API.post('/search/hybrid', { query });
    
    if (response.data.success) {
      setResults(response.data.data.results);
      setError(null);
    }
  } catch (error) {
    // Handle different error types
    if (error.response?.status === 400) {
      setError('Invalid search query');
    } else if (error.response?.status === 500) {
      setError('Server error. Please try again later.');
    } else if (!error.response) {
      setError('Network error. Check your connection.');
    } else {
      setError('Search failed. Please try again.');
    }
    
    console.error('Search error:', error);
  } finally {
    setLoading(false);
  }
}
```

### Handling API Errors in Backend

```javascript
// In search.controller.js
const performSemanticSearch = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.body;

  // Input validation
  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  if (limit < 1 || limit > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  try {
    const results = await semanticSearch(query, parseInt(limit));
    
    return res.status(200).json(
      new ApiResponse(200, { results, count: results.length }, "Success")
    );
  } catch (error) {
    if (error.message.includes("API")) {
      // Fallback to keyword search if Gemini API fails
      const results = await keywordSearch(query, parseInt(limit));
      return res.status(200).json(
        new ApiResponse(
          200,
          { results, count: results.length, warning: "Using keyword search" },
          "Success"
        )
      );
    }
    throw error;
  }
});
```

---

## Testing Examples

### Postman Test Collection

```json
{
  "info": {
    "name": "RAG Search Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Hybrid Search",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/v1/search/hybrid",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"react native tutorial\",\n  \"limit\": 10\n}"
        }
      }
    },
    {
      "name": "Semantic Search",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/v1/search/semantic",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"web development\",\n  \"limit\": 10\n}"
        }
      }
    }
  ]
}
```

---

## Performance Tips

### 1. Optimize Search Queries
```javascript
// ✅ Good: Specific query
const response = await API.post('/search/hybrid', {
  query: 'React hooks tutorial for beginners',
  limit: 10
});

// ❌ Bad: Very long query
const response = await API.post('/search/hybrid', {
  query: 'I want to learn how to use react hooks in javascript for building web applications and this tutorial should be for beginners',
  limit: 10
});
```

### 2. Cache Results
```javascript
const [searchCache, setSearchCache] = useState({});

async function searchVideos(query) {
  // Check cache first
  if (searchCache[query]) {
    setResults(searchCache[query]);
    return;
  }

  // If not in cache, fetch
  const response = await API.post('/search/hybrid', { query });
  
  // Store in cache
  setSearchCache(prev => ({
    ...prev,
    [query]: response.data.data.results
  }));
  
  setResults(response.data.data.results);
}
```

### 3. Debounce Search Input
```javascript
import { useEffect, useState } from 'react';

function SearchWithDebounce() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Perform search with debounced query
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

**Happy Coding! 🚀**
