const URLMODEL = require('../models/url');
const { isUrl } = require('check-valid-url');

async function generateId(req, res) {
    const { customAlphabet } = await import('nanoid');
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);
    const shortURL =  nanoid();
    const aliasExists = await URLMODEL.findOne({ shortURL: shortURL }).exec();
    if(aliasExists){
        generateId();
    } else{
        return res.json({id: shortURL});
    }
    
}

async function generateShortUrlHandler(req, res) {
    const { orgURL, shortURL: customShortURL } = req.body;
    if (!orgURL) {
        return res.status(400).json({ error: 'URL is required' });
    }
    if (!isUrl(orgURL)) {
        return res.status(400).json({ error: 'Invalid URL provided' });
    }
    const shortURL = customShortURL || await generateId();
    try {
        await URLMODEL.create({
            shortURL,
            orgURL,
            urlVisits: []
        });
        return res.json({ id: shortURL });
    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: 'Validation error or duplicate URL' });
        }
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
}


async function getUrlAnalyticsHandler(req, res){
    const shortURL = req.params.shortURL;
    const result = await URLMODEL.findOne({shortURL});
    return res.json({
        totalClicks: result.urlVists.length,
        analytics: result.urlVists,
    });
}


module.exports = {
    generateShortUrlHandler,
    getUrlAnalyticsHandler,
    generateId,
};