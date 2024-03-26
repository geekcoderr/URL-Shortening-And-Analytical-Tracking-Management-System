const express = require('express');
const router = express.Router();
const { GenerateNewShortURL, 
    getAllAnalyticsHTML,
    getAnalyticsByshortId,
    getAllAnalyticsJSON, } = require('../controllers/methodsDefination')

router.post('/', GenerateNewShortURL);
router.get('/analytics/:shortId',getAnalyticsByshortId);
router.get('/analytics/all',getAllAnalyticsHTML);
router.get('/analytics/api',getAllAnalyticsJSON);

module.exports = router;