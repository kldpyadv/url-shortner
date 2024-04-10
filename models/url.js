const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortURL: {
        type: String,
        required: true,
        unique: true,
    },
    orgURL: {
        type: String,
        required: true,
    },
    urlVists : [{timestamp: {type: Number}}],
}, {timestamps: true});

const URLMODEL = mongoose.model('url', urlSchema);

module.exports = URLMODEL;