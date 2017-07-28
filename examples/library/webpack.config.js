'use strict';

const jsBaker = require('js-baker');

let config = {
    entry: {
        jsBakerTest: './src/js/main.js'
    }
};

module.exports = jsBaker.lib(config);