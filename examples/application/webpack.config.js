'use strict';

const jsBaker = require('js-baker'),
    jsBakerConfig = require('./baker.config');

const i18n = {
        de: {
            greeting: 'Hallo Welt'
        },
        en: {
            greeting: 'hello world'
        }
    },
    dirName = require('path').resolve(__dirname);

let config = {
    entry: {
        app: './src/js/main.js'
    },
    dest: `${dirName}/${jsBakerConfig.buildDir}/[lang]`,
    publicPath: './',
    pages: [{
        templatePath: './src/html/layout.html',
        output: 'index.html',
        chunks: ['app']
    }]
};

module.exports = jsBaker.app(config, i18n);