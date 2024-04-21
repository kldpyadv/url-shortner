const mongoose = require('mongoose');
const { isUrl } = require('check-valid-url');

const urlSchema = new mongoose.Schema({
    shortURL: {
        type: String,
        required: true,
        unique: true,
    },
    orgURL: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return isUrl(v);  // Validate the original URL as well
            },
            message: props => `${props.value} is not a valid URL!`
        },
    },
    urlVists : [{timestamp: {type: Number}}],
}, {timestamps: true});

const URLMODEL = mongoose.model('url', urlSchema);

module.exports = URLMODEL;