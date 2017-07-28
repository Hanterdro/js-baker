# js-baker

js-baker is a tool/concept for building apps and libs with webpack, unit tests with jest and e2e tests with nightmare.js.
   
## Introduction

js-baker provide webpack configurations for building apps and libraries with some hooks for individual configurations.

This becomes useful if you have a lot of webpack project. The configurations are designed in a way which should work for the most use cases.

## Install

    npm install --save-dev js-baker
    
If js-baker is not global installed, add this script to the package.json file:

    "scripts": {
      "js-baker": "./node_modules/.bin/js-baker"
    }
    
and run it with `npm run js-baker`.

The advantage to install js-baker local is that each js-baker project can use a different js-baker version.

## CLI

* *js-baker dev* clean the dist directory and run webpack in dev mode with source files
* *js-baker prod* clean the dist directory, run webpack in prod mode and adds dist directory to git (no commit)
* *js-baker watch-dev* clean the dist directory, run webpack in dev mode with source files and activate the watcher
* *js-baker unit*  Starts jest with `jest --bail test/unit/*.js`
* *js-baker e2e* Does a prod build, starts a webserver with the project root as htdocs and starts jest with `jest.js --bail --forceExit test/e2e/*.js` 


## Using js-baker for building libraries

### webpack.config.js

    'use strict';
    
    const jsBaker = require('js-baker');
    
    let config = {
        entry: {
            jsBakerTest: './src/js/main.js'
        }
    };
        
    module.exports = jsBaker.lib(config);
    
### Config options

#### entry

Is the webpack [entry](https://webpack.js.org/configuration/entry-context/#entry) option.
It's recommend to use it always as an object, because the key will be used as the file name and library name.
The files will built as [UMD](https://github.com/umdjs/umd).

    let config = {
        entry: {
            foo: './src/js/main.js',
            bar: './src/js/otherFile.js'
        }
    };
    
This example configuration will create the files `dist/foo.js` and `dist/bar.js`. 
The exports from `./src/js/main.js` are accessible under `window.foo`.

Hint: Use in package.json file the build file for [main](https://docs.npmjs.com/files/package.json#main) and the source file for [module](https://github.com/nodejs/node-eps/blob/4217dca299d89c8c18ac44c878b5fe9581974ef3/002-es6-modules.md#51-determining-if-source-is-an-es-module).

    "main": "dist/foo.js",
    "module": "./src/js/main.js"
    

#### filename

Webpack [filename](https://webpack.js.org/configuration/entry-context/#entry) option.

The default value is `[name].js`.

Normally this option don't need to be changed, besides for css only builds or adding a hash to the file name.


### CSS/SCSS Support

CSS/SCSS Files which are imported in the entry files are built as a concated css file.

*./src/js/main.js*

    import '../scss/foo.scss';
    import '../scss/bar.scss';
    
    export default function() { return "hello world"; }
    
#### CSS only build

    let config = {
        entry: {
            myStyle: './src/scss/design.scss'
        },
        filename: '[name].css'
    };
    
## Using js-baker for building apps

js-baker built for each language an own directory with own JavaScript, CSS and HTML files.

### webpack.config.js

    'use strict';
    
    const jsBaker = require('js-baker');
    
    let i18n = {
        de: {
            greeting: 'hallo'
        },
        en: {
            greeting: 'hello'
        }        
    };
    
    let config = {
        entry: {
            basic: './src/js/basic.js',
            login: './src/js/login.js',
        },
        dest: `${require('path').resolve(__dirname)}/htdocs/[lang]`,
        publicPath: '/[lang]',
        pages: [{
            templatePath: './src/html/layout.html',
            output: 'login/index.html',
            chunks: ['basic', 'login']
        }]
    };
        
    module.exports = jsBaker.app(config, i18n);
    
### Config options

#### entry

Webpack [entry](https://webpack.js.org/configuration/entry-context/#entry) option.

#### dest

Webpack [path](https://webpack.js.org/configuration/output/#output-path) option.

Placeholder `[lang]` for the language.

Default: `app.[hash].js`.

#### publicPath

Webpack [publicpath](https://webpack.js.org/configuration/output/#output-publicpath) option.

Placeholder `[lang]` for the language.

Default: `./`.


#### pages

A list with an object for each html page.

#### templatePath

Path to a HTML template.

ES6 Template variables are supported:

    <div>
        ${require('html-loader?removeAttributeQuotes=false,interpolate=true!./view/content.html')}
        <hr />
    </div>
    
#### output

Output file in the `dest` directory.

#### chunks

The list of chunks (object keys from the entries) which should be used for the page.

js-baker takes care that the order of the list of the chunks is strictly adhered in the html output file.

## Tests

js-baker recommends jest und nightmare.js for unit and e2e tests. Of course every other test library/framework can be used.

jest requires for es6 imports a .babelrc file:

    {
      "presets": ["es2015"]
    }
    
js-baker requires that unit tests are in the directory `test/unit` and e2e tests under `test/e2e`.

When e2e are started with the js-baker cli a webserver is automatically started (first free port between 4444 and 8888). The  port can be accessed in the e2e specs with `process.env.E2E_PORT`.

For more implementation details take a look the *library* example (`examples/library/test`).
    
## Known issues

* The CLI assumes that the build directory is always `dist/`. Workaround: use own npm scripts for applications.