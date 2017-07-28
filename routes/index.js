const routes = require('express').Router();
const task = require('./task');
// const user = require('./user');
// const comment = require('./comment');
// const security = require('./security');

// routes.use('/', security);
routes.use('/task', task);
// routes.use('/user', user);
// routes.use('/comment', comment);
// 
module.exports = routes;
