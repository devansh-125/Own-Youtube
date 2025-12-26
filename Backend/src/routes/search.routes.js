import express from "express";
import {
  performSemanticSearch,
  performKeywordSearch,
  performHybridSearch,
} from "../controllers/search.controller.js";

const router = express.Router();

/**
 * @route   POST /api/v1/search/semantic
 * @desc    Perform semantic search using Gemini RAG embeddings
 * @access  Public
 */
router.post("/semantic", performSemanticSearch);

/**
 * @route   POST /api/v1/search/keyword
 * @desc    Perform keyword-based search (faster, no embeddings)
 * @access  Public
 */
router.post("/keyword", performKeywordSearch);

/**
 * @route   POST /api/v1/search/hybrid
 * @desc    Perform hybrid search combining semantic and keyword search
 * @access  Public
 */
router.post("/hybrid", performHybridSearch);

export default router;
