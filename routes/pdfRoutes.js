const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const pdfController = require("../controllers/pdfController");

// ✅ Remove multer-based uploadMiddleware, we're using express-fileupload

// ✅ Use named functions from controller
router.post("/replace-text", authMiddleware, pdfController.replaceTextInPDF);
router.post("/extract-text", pdfController.extractTextFromPDF);

module.exports = router;
