import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  semanticSearch,
  keywordSearch,
  hybridSearch,
} from "../services/search.service.js";

/**
 * Semantic search using Gemini RAG
 * POST /api/v1/search/semantic
 */
const performSemanticSearch = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.body;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const results = await semanticSearch(query, parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        count: results.length,
        searchType: "semantic",
      },
      "Semantic search successful"
    )
  );
});

/**
 * Keyword-based search (faster, no embeddings)
 * POST /api/v1/search/keyword
 */
const performKeywordSearch = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.body;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const results = await keywordSearch(query, parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        count: results.length,
        searchType: "keyword",
      },
      "Keyword search successful"
    )
  );
});

/**
 * Hybrid search combining semantic and keyword search
 * POST /api/v1/search/hybrid
 */
const performHybridSearch = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.body;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const results = await hybridSearch(query, parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        count: results.length,
        searchType: "hybrid",
      },
      "Hybrid search successful"
    )
  );
});

export {
  performSemanticSearch,
  performKeywordSearch,
  performHybridSearch,
};
