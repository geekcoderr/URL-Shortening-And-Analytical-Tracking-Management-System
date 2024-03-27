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



async function getAllAnalyticsHTML(req, res) {
    const result = await URL.find({});
    let html = `
    <H2>Total Redirections: ${result.length}</H2>
    </br>
    <ol type="1">
    ${result.map((data) => `<li>
    <H4> Redirect-ID: [${data.shortId}] >> has (${data.visitHistory.length}) CLICKS </H4>
    ${(data.visitHistory).map((vdata) => `DateTime: ${vdata.timestamp} from IP-Address ${vdata.ipAddress}</br>`).join(',')}
    `).join('')}</li>
    </ol>
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

async function getAnalyticsByshortId(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.status(200).json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
};


module.exports = {
    GenerateNewShortURL,
    getAnalyticsByshortId,
    getAllAnalyticsHTML,
    getAllAnalyticsJSON,
};