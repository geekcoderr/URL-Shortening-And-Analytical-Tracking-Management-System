const express = require('express');
const app = express();
const PORT = 8000;
const urlRoute = require('./routes/url');
const { mongoInit } = require('./connect');
const databaseName = 'urldb';
const URL = require('./models/urlSchamea');
mongoInit(`mongodb://127.0.0.1:27017/${databaseName}`);

const cors = require('cors');
app.use(cors());


const getDateTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDateTime = date.toLocaleString(); // Converts date to local date and time string

    return formattedDateTime;
};

app.use(express.json());

app.use('/url', urlRoute);

app.use('/:shortId', async (req, res, next) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId: shortId,
    },
        {
            $push: {
                visitHistory: {
                    timestamp: getDateTimeFromTimestamp(Date.now()),
                    ipAddress: req.ip,
                },
            },
        });
    res.redirect(entry?.redirectUrl);

});


app.listen(PORT, () => console.log(`Server Started on http://localhost:${PORT}`));