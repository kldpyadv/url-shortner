const express = require('express');
const { checkAliasAvailabilityHandler } = require('../controllers/api');
const apiRouter = express.Router();


apiRouter.get('/check-alias', checkAliasAvailabilityHandler);

module.exports = apiRouter;