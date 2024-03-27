const express = require('express');
const router = express.Router();
const { GenerateNewShortURLByGet,
    GenerateNewShortURLByPost,
    getAnalyticsByshortId,
    getAllAnalyticsHTML,
    getAllAnalyticsJSON, } = require('../controllers/methodsDefination')

router.get('/', GenerateNewShortURLByGet);
router.post('/', GenerateNewShortURLByPost);
router.get('/monitor/:shortId', getAnalyticsByshortId);
router.get('/analytics/all', getAllAnalyticsHTML);
router.get('/analytics/api', getAllAnalyticsJSON);

module.exports = router;