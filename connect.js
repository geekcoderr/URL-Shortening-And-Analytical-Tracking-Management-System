const mongoose = require('mongoose');

async function mongoInit(url) {
    return mongoose.connect(url).then(() => console.log('MongoDB  connected')).catch((err) => console.log("Error connecting to MongoDB", err));
}

module.exports =
{
    mongoInit,
}; 