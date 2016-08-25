'use strict';

const ProgressBar = require('progress');

let bar;
let firstProgress = true;

const env = process.env.NODE_ENV;
const isLocal = !env || env === 'local';
const isRemote = env === 'remote';
const isCI = env === 'ci';
const browserName = process.env.NODE_BROWSER || 'firefox';

const testingUrl = (process.env.BASE_URL || 'http://localhost:8000');
const host = isCI ? (process.env.HOST || 'seleniumff') : 'localhost';
const port = 4444;

const travisJob = process.env.TRAVIS_JOB_NUMBER;
const travisBuild = process.env.TRAVIS_BUILD_NUMBER;

let webdriverOptions = {
    host: host,
    port: port,
    outputDir: 'output',
    baseUrl: testingUrl,
    restart: false,
    desiredCapabilities: {
        name: (process.env.TEST_NAME || 'Sunrise'),
        browserName: browserName
    }
};

if (isRemote && travisJob && travisBuild) {
    webdriverOptions.user = process.env.SAUCE_USERNAME;
    webdriverOptions.key = process.env.SAUCE_ACCESS_KEY;
    webdriverOptions.port = 4445;
    webdriverOptions.desiredCapabilities['tunnel-identifier'] = travisJob;
    webdriverOptions.desiredCapabilities.build = travisBuild
}


module.exports = {
    seleniumOptions: {
        chrome: {
            // check for more recent versions of chrome driver here:
            // https://chromedriver.storage.googleapis.com/index.html
            version: '2.21',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com'
        },
        progressCb: progressCb
    },

    webdriverOptions: webdriverOptions,

    useLocalSelenium: isLocal,
};

function progressCb(total, progress, chunk) {
    if (firstProgress) {
        console.log('');
        console.log('');
        firstProgress = false
    }

    if (!bar)
        bar = new ProgressBar(
            'selenium-standalone installation [:bar] :percent :etas', {
                total: total,
                complete: '=',
                incomplete: ' ',
                width: 20
            }
        );

    bar.tick(chunk)
}
