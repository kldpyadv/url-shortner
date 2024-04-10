const URLMODEL = require('../models/url');

async function checkAliasAvailabilityHandler(req, res){
    const { alias, orgURL } = req.query;
    if (!isValidUrl(orgURL)) {
        return res.status(400).json({ error: 'Invalid orgURL' });
    }
    try {
        const aliasExists = await URLMODEL.findOne({ shortURL: alias }).exec();
        res.json({ available: !aliasExists });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    checkAliasAvailabilityHandler,
};