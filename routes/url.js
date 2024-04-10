const express = require('express');
const { generateShortUrlHandler, getUrlAnalyticsHandler, generateId } = require('../controllers/url');
const router = express.Router();

router.post('/', generateShortUrlHandler);

router.get('/analytics/:shortURL', getUrlAnalyticsHandler);
router.get('/generate-url', generateId);

module.exports = router;