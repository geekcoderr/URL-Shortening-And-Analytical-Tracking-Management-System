const express = require('express');
const router = express.Router();
const { GenerateNewShortURLByGet,
    GenerateNewShortURLByPost,
    getAnalyticsByshortId,
    getAllAnalyticsHTML,
    getAllAnalyticsJSON,
    getAdminAccessJSON,
    deleteDataObject } = require('../controllers/methodsDefination')

router.get('/', GenerateNewShortURLByGet);
router.post('/', GenerateNewShortURLByPost);
router.get('/monitor/:shortId', getAnalyticsByshortId);
router.get('/analytics/all', getAllAnalyticsHTML);
router.get('/analytics/api', getAllAnalyticsJSON);
router.get('/admin/api',getAdminAccessJSON);
router.delete('/del/:id',deleteDataObject)

module.exports = router;