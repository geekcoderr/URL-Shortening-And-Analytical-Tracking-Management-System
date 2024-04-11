const shortIds = require('shortid');
const URL = require('../models/urlSchamea');

async function GenerateNewShortURLByPost(req, res) {
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


// Function for handeling data storage and id genration from http GET request if needed
async function GenerateNewShortURLByGet(req, res) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "Url field is required" });
    };
    const shortid = shortIds();
    await URL.create({
        shortId: shortid,
        redirectUrl: url,
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
    const reversedResult = await URL.find({});
    // const result=await URL.find({},[shortId,visitHistory]);

    const result = reversedResult.reverse();

    return res.status(200).json([{ 'Total-Redirections': result.length },
    {
        analytics: result.map((data) => ({
            shortId: data.shortId,
            Clicks: data.visitHistory.length,
            Visits: data.visitHistory,
        })),
    }]);
};


async function getAdminAccessJSON(req, res) {
    const reversedResult = await URL.find({});
    // const result=await URL.find({},[shortId,visitHistory]);

    const result = reversedResult.reverse();

    return res.status(200).json([{ 'Total-Redirections': result.length },
    {
        analytics: result.map((data, index) => ({
            // Entry Number:
            entryNumber: index + 1,
            id: data._id,
            redirectUrl: data.redirectUrl,
            shortId: data.shortId,
            Clicks: data.visitHistory.length,
            Visits: data.visitHistory,
        })),
    }]);
};



// async function getAnalyticsByshortId(req, res) {
//     const shortId = req.params.shortId;
//     const result = await URL.findOne({ shortId });
//     return res.status(200).json({
//         totalClicks: result.visitHistory.length,
//         analytics: result.visitHistory,
//     });
// };


async function getAnalyticsByshortId(req, res) {
    const shortId = req.params.shortId;
    try {
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        return res.status(200).json({
            totalClicks: result.visitHistory.length,
            analytics: result,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


async function deleteDataObject(req, res) {
    const idToDelete = req.params.id; // Assuming the ID to delete is passed as a parameter

    try {
        // Find and delete the document by its _id
        const deletedObject = await URL.findByIdAndDelete(idToDelete);

        if (!deletedObject) {
            return res.status(404).json({ message: 'Object not found' });
        }

        return res.status(200).json({ message: 'Object deleted successfully' });
    } catch (error) {
        console.error('Error deleting object:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = {
    GenerateNewShortURLByGet,
    GenerateNewShortURLByPost,
    getAnalyticsByshortId,
    getAllAnalyticsHTML,
    getAllAnalyticsJSON,
    getAdminAccessJSON,
    deleteDataObject,
};