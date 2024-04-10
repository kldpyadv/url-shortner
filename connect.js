const mongoose = require('mongoose');

async function dbConnect(url) {
    return mongoose.connect(url);
}

module.exports = {
    dbConnect,
};