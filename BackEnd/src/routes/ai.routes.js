const express = require('express');
const aiController = require("../controllers/ai.controller")
const pdfController = require("../../chatbot/controller/controller.js")
//const quizController = require("../../mcq/controller/controller.js")
const router = express.Router();


router.post("/get-review", aiController.getReview)
router.post("/get-pdf", pdfController.getPdf)
//router.post("/get-quiz", quizController.quizController)

module.exports = router;    