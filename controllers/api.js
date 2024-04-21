const URLMODEL = require('../models/url');
const { isUrl } = require('check-valid-url');

async function checkAliasAvailabilityHandler(req, res){
    const { alias, orgURL } = req.query;
    if (!isUrl(orgURL)) {
        return res.status(400).json({ error: 'Invalid orgURL' });
    }
    try {
        const aliasExists = await URLMODEL.findOne({ shortURL: alias }).exec();
        res.json({ available: !aliasExists });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    checkAliasAvailabilityHandler,
};