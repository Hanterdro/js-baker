'use strict';

const jsBaker = require('js-baker');

const i18n = {
    de: {
        greeting: 'Hallo Welt'
    },
    en: {
        greeting: 'hello world'
    }
};

let config = {
    entry: {
        app: './src/js/main.js'
    },
    dest: `${require('path').resolve(__dirname)}/htdocs/[lang]`,
    publicPath: './',
    pages: [{
        templatePath: './src/html/layout.html',
        output: 'index.html',
        chunks: ['app']
    }]
};

module.exports = jsBaker.app(config, i18n);