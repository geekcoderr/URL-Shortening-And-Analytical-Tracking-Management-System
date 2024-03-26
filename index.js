const express = require('express');
const app = express();
const PORT = 8001;
const urlRoute = require('./routes/url');
const { mongoInit } = require('./connect');
const databaseName = 'urldb';
const URL = require('./models/urlSchamea');
mongoInit(`mongodb://127.0.0.1:27017/${databaseName}`);

app.use(express.json());

app.use('/url', urlRoute);

app.use('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId:shortId,
    },
    {
        $push:{
            visitHistory: {
                timestamp: Date.now(),
                ipAddress: req.ip,
            },
        },
    });
    res.redirect(entry.redirectUrl);
});


app.listen(PORT, () => console.log(`Server Started on http://localhost:${PORT}`));