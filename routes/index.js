const routes = require('express').Router();
const task = require('./task');
const security = require('./security');

routes.use('/', security);
routes.use('/task', task);

module.exports = routes;
