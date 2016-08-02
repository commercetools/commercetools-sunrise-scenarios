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


module.exports = {
    // This is used only for local development.
    webdriverUrl: `http://${host}:4444/wd/hub`,

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

    webdriverOptions: {
        host: `${host}`,
        outputDir: 'output',
        baseUrl: testingUrl,
        desiredCapabilities: {
            browserName: browserName
        }
    },

    useLocalSelenium: isLocal || isRemote,
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
