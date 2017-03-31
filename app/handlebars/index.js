var exphbs  = require('express-handlebars');
var helpers = require('./helpers');

var hbs = exphbs.create({
    helpers: helpers,
    layoutsDir: 'views',
    defaultLayout: 'layout',
    extname: '.hbs',
    partialsDir: [
        'views/partials/'
    ]
});

module.exports = hbs;