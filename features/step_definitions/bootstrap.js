'use strict';

const randoms = require('../utils/randoms');
const expect = require('expect');
const world = require('../support/world');

module.exports = function bootstrap() {

    this.Given(/^I navigate to "(.+)"$/,
        function (url) {
            return this.amOnPage(url);
        });

    this.Then(/^I see in title "(.+)"$/,
        function (title) {
            return this.seeInTitle(title);
        });

    this.When(/^I click "(.+)"$/, function (locator) {
        return this.click(locator)
    });

    this.When(/^I click "(.+)" within "(.+)"$/, function (locator, context) {
        return this.click(locator, context)
    });

    this.Then(/^I see in current url "(.+)"$/, function (uri) {
        return this.seeInCurrentUrl(uri);
    });

    this.Then(/^I see "(.+)"$/, function (text) {
        return this.see(text);
    });

    this.Then(/^I see within "(.+)" "(.+)"$/, function (locator, text) {
        return this._withinBegin(locator).then(() => {
            return this.see(text)
        }).then(() => {
            return this._withinEnd()
        });
    });

    this.Then(/^within "(.+)"$/, function (locator) {
        return this._withinBegin(locator);
    });

    this.Then(/^end within$/, function () {
        return this._withinEnd();
    })
};
