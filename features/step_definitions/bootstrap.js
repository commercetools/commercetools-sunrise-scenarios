'use strict'

const randoms = require('../utils/randoms')
const expect = require('expect');
const world = require('../support/world');

module.exports = function bootstrap() {

    this.Given(/^I navigate to "(.+)"$/,
        function (url) {
            return this.amOnPage(url);
        });

    this.Then(/^I see the text "(.+)"$/,
        function (title) {
            return this.seeInTitle(title);
        });
};
