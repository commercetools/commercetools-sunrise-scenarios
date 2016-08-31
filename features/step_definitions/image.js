'use strict';

const randoms = require('../utils/randoms');
const world = require('../support/world');
const truth = require('../../lib/assert/truth').truth;

module.exports = function image() {
    this.Then(/^I see an image at "([^"]*)"$/, function(locator) {
        return this.browser.execute(function(locator) {
            let element = document.querySelector(locator);
            if (element) {
                return element.complete && typeof element.naturalWidth != "undefined" && element.naturalWidth > 0;
            }
            return false;
        }, locator).then((result) => { return truth(`image at ${locator}`).assert(result.value) });
    });
};
