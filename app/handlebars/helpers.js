'use strict';
const datetime = require('node-datetime');

module.exports = {
    dateYmdHis: (dateString) => {
        let dateTime = datetime.create(dateString);
        return dateTime.format('Y-m-d H:M:S');
    },
    compare: (left, right, options) => {
        if (arguments.length < 3) {
            throw new Error("Helper 'compare' needs 2 parameters");
        }

        let operator = options.hash.operator || "==";

        let operators = {
            '==':       (left,right) => { return left == right; },
            '===':      (left,right) => { return left === right; },
            '!=':       (left,right) => { return left != right; },
            '<':        (left,right) => { return left < right; },
            '>':        (left,right) => { return left > right; },
            '<=':       (left,right) => { return left <= right; },
            '>=':       (left,right) => { return left >= right; },
            'typeof':   (left,right) => { return typeof left == right; }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
        }

        let result = operators[operator](left,right);

        if(result) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    times: (n, block) => {
        let accum = '';
        block.data.used = block.hash.use;
        for(let i = 1; i <= n; ++i) {
            block.data.current = i;
            accum += block.fn(i);
        }

        return accum;
    },
    substring: (text, charactersCount) => {
        return text.substr(0, charactersCount) + '...';
    }
};