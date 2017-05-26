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
        if (0 === text.length) {
            return '';
        }
        return text.substr(0, charactersCount) + '...';
    },
    errorMessage: (errors, fieldName) => {
        let message = '';
        errors.map((element) => {
            if (typeof element[fieldName] !== 'undefined') {
                message = element[fieldName].message;
            }
        });

        return message;
    },
    toHex: (string) => {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }

        return colour;
    },
    firstLetter: (string) => {
        return string.charAt(0);
    },
    inArray: (needle, haystack) => {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) {
                return true;
            }
        }
        return false;
    },
    isCheckboxChecked: (needle, haystack) => {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) {
                return 'checked';
            }
        }
        return '';
    },
    stringReplace: (replace, to, subject) => {
        return subject.replace(replace,to);
    },
    baseUrl: () => {
        return 'http://localhost:3000/';
    },
    isImage: (mimeType) => {
        let mimeTypeExploded = mimeType.split('/');
        return (
            mimeTypeExploded.constructor === Array
            && mimeTypeExploded.length > 0
            && mimeTypeExploded[0] === 'image'
        );
    },
    getStatusForValue: (key) => {
        var statusArray = Task.getTaskStatusArray();
        console.log(statusArray);
        console.log(key);
        return statusArray[key].name;
    }
};