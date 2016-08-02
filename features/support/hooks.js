'use strict';

const colors = require('colors/safe');
const selenium = require('selenium-standalone');
const unique = require('../utils/randoms').unique;
const promisify = require('../utils/async').promisify;
const configuration = require('../utils/configuration');

const seleniumInstall = promisify(selenium.install);
const seleniumStart = promisify(selenium.start);


/* eslint-disable new-cap */
module.exports = function hooks() {

    let browser, seleniumStarted = false;

    this.Before(function (/*scenario*/) {
        const self = this;

        const password = unique();
        const email = `${configuration.prefix}${password}@commercetools.com`;
        const user = {
            email, password,
            firstName: 'Foo',
            lastName: 'Bar'
        };

        return Promise.all([
            (configuration.useLocalSelenium // Do not use this on CI
                ? seleniumInstall(configuration.seleniumOptions)
                .then(() => {
                    if (seleniumStarted) return void 0;
                    seleniumStarted = true;
                    return seleniumStart(configuration.seleniumOptions);
                })
                : Promise.resolve())

                .then(() => {
                    browser = this._before();
                    return browser;
                }),
        ])
        .then(results => {
            self.browser = browser;
            self.login = {email, password};
            self.data = results[1]
        })
    });

    this.After(function (scenario) {
        this._withinEnd();

        if (scenario.isFailed()) {
            return this._failed(scenario).then(() => this._after());
        }
        return this._after();
    });
};
