const express = require('express');
const router = express.Router();
const { GenerateNewShortURL,
    getAnalyticsByshortId,
    getAllAnalyticsHTML,
    getAllAnalyticsJSON, } = require('../controllers/methodsDefination')

router.post('/', GenerateNewShortURL);
router.get('/monitor/:shortId', getAnalyticsByshortId);
router.get('/analytics/all', getAllAnalyticsHTML);
router.get('/analytics/api', getAllAnalyticsJSON);

module.exports = router;