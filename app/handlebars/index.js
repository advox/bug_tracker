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
hbs.handlebars.registerPartial('topMenu', fs.readFileSync(partialsDir + 'menu/top.hbs', 'utf8'));
hbs.handlebars.registerPartial('taskGrid', fs.readFileSync(partialsDir + 'task/grid.hbs', 'utf8'));
hbs.handlebars.registerPartial('userGrid', fs.readFileSync(partialsDir + 'user/grid.hbs', 'utf8'));
hbs.handlebars.registerPartial('commentEntries', fs.readFileSync(partialsDir + 'comment/entries.hbs', 'utf8'));
hbs.handlebars.registerPartial('commentEntry', fs.readFileSync(partialsDir + 'comment/entry.hbs', 'utf8'));
hbs.handlebars.registerPartial('commentAdd', fs.readFileSync(partialsDir + 'comment/add.hbs', 'utf8'));
hbs.handlebars.registerPartial('errorMessages', fs.readFileSync(partialsDir + 'error/list.hbs', 'utf8'));

module.exports = hbs;