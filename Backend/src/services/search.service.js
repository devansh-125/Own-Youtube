import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { pipeline } from "@xenova/transformers";

// Initialize Xenova embedding pipeline (runs locally, no API key needed!)
// Model: all-MiniLM-L6-v2 - produces 384-dimensional embeddings
let embeddingPipeline = null;

/**
 * Initialize the embedding pipeline (lazy load on first use)
 */
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log("🚀 Initializing Xenova embedding pipeline...");
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log("✅ Xenova embedding pipeline initialized");
  }
  return embeddingPipeline;
}

/**
 * Generate embedding for text using Xenova (local, no API key needed!)
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} - Embedding vector (384 dimensions)
 */
async function generateEmbedding(text) {
  try {
    const pipe = await initEmbeddingPipeline();
    
    // Get embedding from Xenova
    const result = await pipe(text, {
      pooling: 'mean',
      normalize: true,
    });

    // Convert to array and return
    const embedding = Array.from(result.data);
    
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error.message);
    throw new ApiError(500, "Failed to generate embedding: " + error.message);
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} vec1 - First vector
 * @param {Array} vec2 - Second vector
 * @returns {number} - Similarity score (0-1)
 */
function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Semantic search using pre-computed embeddings stored in database
 * Uses local Xenova embeddings - no API key required!
 * @param {string} query - Search query
 * @param {topK} topK - Number of top results to return
 * @returns {Promise<Array>} - Top K matching videos
 */
async function semanticSearch(query, topK = 10) {
  try {
    // Get ALL published videos (with and without embeddings)
    const allVideos = await Video.find({
      isPublished: true,
    })
      .select(
        "title discription thumbnail videoFile duration views owner createdAt embedding"
      )
      .populate("owner", "username avatar")
      .lean();

    if (allVideos.length === 0) {
      return [];
    }

    // Generate embedding for the search query using Xenova
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarity for all videos
    const videosWithScores = allVideos
      .map(video => {
        let similarityScore = 0;
        let keywordBoost = 0;

        // If video has embedding, calculate semantic similarity
        if (video.embedding && video.embedding.length > 0) {
          similarityScore = cosineSimilarity(queryEmbedding, video.embedding);
        }

        // Add keyword matching boost (higher priority for exact and similar matches)
        const queryLower = query.toLowerCase();
        const titleLower = video.title.toLowerCase();
        const descLower = video.discription.toLowerCase();
        const queryWords = queryLower.split(' ').filter(word => word.length > 0);

        // Exact title match gets highest boost
        if (titleLower.includes(queryLower)) {
          keywordBoost += 1.0;
        }
        // Partial title matches for each word
        else {
          let titleWordMatches = 0;
          queryWords.forEach(word => {
            // Exact word match
            if (titleLower.includes(word)) {
              titleWordMatches += 0.3;
            }
            // Similar word matches (handle common variations)
            else if (word === 'bahi' && titleLower.includes('bhai')) {
              titleWordMatches += 0.25; // bahi -> bhai
            }
            else if (word === 'bhai' && titleLower.includes('bahi')) {
              titleWordMatches += 0.25; // bhai -> bahi
            }
            else if (word === 'life' && (titleLower.includes('life') || titleLower.includes('college'))) {
              titleWordMatches += 0.2; // life related content
            }
          });
          keywordBoost += titleWordMatches;
        }

        // Description matches get lower boost
        if (descLower.includes(queryLower)) {
          keywordBoost += 0.3;
        }
        else {
          let descWordMatches = 0;
          queryWords.forEach(word => {
            if (descLower.includes(word)) {
              descWordMatches += 0.1;
            }
          });
          keywordBoost += descWordMatches;
        }

        // Combine semantic similarity with keyword boost
        const finalScore = similarityScore + keywordBoost;

        return {
          ...video,
          similarityScore: finalScore,
          semanticScore: similarityScore,
          keywordBoost: keywordBoost,
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by final score (highest first)
      .slice(0, topK)
      .map(({ embedding, similarityScore, semanticScore, keywordBoost, ...video }) => video); // Remove internal scores

    return videosWithScores;
  } catch (error) {
    console.error("Error in semantic search:", error);
    throw error;
  }
}

/**
 * Fallback keyword-based search (faster, without embeddings)
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Matching videos
 */
async function keywordSearch(query, limit = 10) {
  try {
    const results = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { discription: { $regex: query, $options: "i" } },
      ],
      isPublished: true,
    })
      .select(
        "title discription thumbnail videoFile duration views owner createdAt embedding"
      )
      .populate("owner", "username avatar")
      .limit(limit)
      .lean();

    return results;
  } catch (error) {
    console.error("Error in keyword search:", error);
    throw error;
  }
}

/**
 * Hybrid search combining semantic and keyword search
 * Uses Xenova local embeddings - no API key required!
 * Returns ALL videos ranked by semantic similarity to query
 * @param {string} query - Search query
 * @param {number} topK - Number of results to return (optional, for performance)
 * @returns {Promise<Array>} - All videos ranked by similarity
 */
async function hybridSearch(query, topK = 50) {
  try {
    // For true semantic search like YouTube/Google, rank ALL videos by similarity
    // This gives better results than keyword-only or hybrid approaches
    return await semanticSearch(query, topK);
  } catch (error) {
    console.error("Error in hybrid search:", error);
    // Fallback to basic keyword search
    try {
      return await keywordSearch(query, topK);
    } catch (keywordError) {
      console.error("Keyword search also failed:", keywordError);
      return [];
    }
  }
}

/**
 * Generate and save embedding for a video (called when video is uploaded)
 * This extracts content from video and creates embedding for efficient RAG search
 * @param {Object} video - Video document
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateAndSaveVideoEmbedding(video) {
  try {
    // Create rich content from all video metadata
    // This is what gets embedded for semantic search
    const videoContent = [
      video.title,           // Title
      video.discription,     // Description/transcript
      // You can add more content here:
      // - tags (if available)
      // - categories
      // - auto-generated captions/transcript
    ]
      .filter(Boolean) // Remove null/undefined
      .join(" "); // Combine all content

    console.log(`Generating embedding for video: ${video.title}`);
    console.log(`Content length: ${videoContent.length} characters`);

    // Generate embedding from all video content
    const embedding = await generateEmbedding(videoContent);

    console.log(`✅ Embedding generated for video: ${video._id}`);

    return embedding;
  } catch (error) {
    console.error(
      `Error generating embedding for video ${video._id}:`,
      error.message
    );
    throw error;
  }
}

export { generateEmbedding, semanticSearch, keywordSearch, hybridSearch, generateAndSaveVideoEmbedding };
