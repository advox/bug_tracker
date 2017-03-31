const exphbs  = require('express-handlebars');
const helpers = require('./helpers');
const fs = require('fs');

const hbs = exphbs.create({
    helpers: helpers,
    layoutsDir: 'views',
    defaultLayout: 'layout',
    extname: '.hbs',
    partialsDir: [
        'views/partials/'
    ]
});

const partialsDir = __dirname + '/../../views/partials/';
hbs.handlebars.registerPartial('taskGrid', fs.readFileSync(partialsDir + 'task/grid.hbs', 'utf8'));

module.exports = hbs;