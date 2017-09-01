const routes = require('express').Router();
const session = require('./session');
const task = require('./task');
// const user = require('./user');
const comment = require('./comment');

routes.use('/session', session);
routes.use('/task', task);
// routes.use('/user', user);
routes.use('/comment', comment);

module.exports = routes;
