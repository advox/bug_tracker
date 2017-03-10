const hbs = require('express-handlebars');
const handlebars = require('handlebars');
const helpers = require('./helpers');

module.exports = function () {
    handlebars.registerHelper('dateYmdHis', (dateString) => helpers.dateYmdHis(dateString));
    return hbs({
        defaultLayout: 'main',
    })
};