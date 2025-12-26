import { GoogleGenerativeAI } from "@google/generative-ai";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate embedding for text using Gemini
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const result = await model.embedContent({
      content: { parts: [{ text: text }] }
    });
    const embedding = result.embedding.values;

    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new ApiError(500, "Failed to generate embedding");
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
 * @param {string} query - Search query
 * @param {topK} topK - Number of top results to return
 * @returns {Promise<Array>} - Top K matching videos
 */
async function semanticSearch(query, topK = 10) {
  try {
    // Get all published videos with embeddings
    const videos = await Video.find({
      isPublished: true,
      embedding: { $exists: true, $ne: null } // Only videos with embeddings
    })
      .select(
        "title discription thumbnail videoFile duration views owner createdAt embedding"
      )
      .populate("owner", "username avatar")
      .lean();

    if (videos.length === 0) {
      return [];
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarity with pre-stored embeddings (fast!)
    const videosWithScores = videos
      .map(video => ({
        ...video,
        similarityScore: cosineSimilarity(queryEmbedding, video.embedding),
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK)
      .map(({ embedding, similarityScore, ...video }) => video); // Remove embedding & score before returning

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
        "title discription thumbnail videoFile duration views owner createdAt"
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
 * Uses pre-computed embeddings stored in database
 * @param {string} query - Search query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} - Combined search results
 */
async function hybridSearch(query, topK = 10) {
  try {
    // Get keyword search results first (fast pre-filtering)
    const keywordResults = await keywordSearch(query, topK * 3);

    if (keywordResults.length === 0) {
      return [];
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    // For each keyword result, calculate similarity with pre-stored embeddings
    const rankedResults = keywordResults
      .filter(video => video.embedding && video.embedding.length > 0) // Only videos with embeddings
      .map(video => {
        const similarityScore = cosineSimilarity(queryEmbedding, video.embedding);
        return {
          ...video,
          similarityScore,
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK)
      .map(({ similarityScore, ...video }) => {
        // Remove similarity score before returning
        return video;
      });

    return rankedResults;
  } catch (error) {
    console.error("Error in hybrid search:", error);
    throw error;
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
