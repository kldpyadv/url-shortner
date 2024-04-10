const URLMODEL = require('../models/url');

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

async function generateShortUrlHandler(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error: 'url is required'})
    const shortURL = await generateId() ;
    await URLMODEL.create({
        shortURL: shortURL,
        orgURL: body.url,
        urlVists: [],
    });

    return res.json({id: shortURL});
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