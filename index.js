const express = require('express');
const app = express();
const PORT = 8000;
const urlRoute = require('./routes/url');
const { mongoInit } = require('./connect');
const databaseName = 'urldb';
const URL = require('./models/urlSchamea');
mongoInit(`mongodb://127.0.0.1:27017/${databaseName}`);
const os = require('os');

const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (const { address, family, internal } of interface) {
            if (family === 'IPv4' && !internal) {
                // If the address is in the format ::ffff:112.196.62.5, extract the IPv4 portion
                const ipv4Address = address.includes('::ffff:') ? address.split(':').pop() : address;
                return ipv4Address;
            }
        }
    }
};



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

const ipAddress = getIPAddress();

app.listen(PORT, () => console.log(`Server Started on http://${ipAddress}:${PORT}`));