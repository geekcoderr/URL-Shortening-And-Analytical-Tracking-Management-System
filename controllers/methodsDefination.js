const shortIds = require('shortid');
const URL = require('../models/urlSchamea');

async function GenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "Url field is required" });
    };
    const shortid = shortIds();
    await URL.create({
        shortId: shortid,
        redirectUrl: body.url,
        visitHistory: [],
    });
    return res.json({ id: shortid });
};

async function getAnalyticsByshortId(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId: shortId});
    return res.status(200).json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
};

async function getAllAnalyticsHTML(req, res) {
    const result = await URL.find({});
    let html = `
    <short>Total Redirections: ${result.length}</short>
    </br>    
    <ul>
    ${result.map((data) => `<ul>
    <short> @Redirect-ID: ${data.shortId} has ${data.visitHistory.length} Clicks </short></br>
    ${(data.visitHistory).map((vdata) => `<li>${vdata}</li>`)}
    </ul>`)}
    </ul>
    `;
    return res.status(200).send(html);
};

async function getAllAnalyticsJSON(req, res) {
    const result = await URL.find({});
    // const result=await URL.find({},[shortId,visitHistory]);

    return res.status(200).json([{ 'Total-Redirections': result.length },
    {
        analytics: result.map((data) => ({
            shortId: data.shortId,
            Clicks: data.visitHistory.length,
            Visits: data.visitHistory,
        })),
    }]);
};

module.exports = {
    GenerateNewShortURL,
    getAllAnalyticsHTML,
    getAnalyticsByshortId,
    getAllAnalyticsJSON,
};