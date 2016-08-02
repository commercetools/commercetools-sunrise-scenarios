'use strict';

const randoms = require('../utils/randoms');
const expect = require('expect');
const world = require('../support/world');

module.exports = function bootstrap() {

    this.Given(/^I navigate to "([^"]+)"$/,
        function (url) {
            return this.amOnPage(url);
        });

    this.Then(/^I see in title "([^"]+)"$/,
        function (title) {
            return this.seeInTitle(title);
        });

    this.Given(/^I click "([^"]+)"$/, function (locator) {
        return this.click(locator);
    });

    this.Given(/^I click "([^"]+)" within "([^"]+)"$/, function (locator, context) {
        return this.click(locator, context);
    });

    this.Given(/^I doubleclick "([^"]+)"$/, function (locator) {
        return this.doubleClick(locator);
    });

    this.Given(/^I doubleclick "([^"]+)" within "([^"]+)"$/, function (locator, context) {
        return this.doubleClick(locator, context);
    });

    this.Given(/^I rightclick "([^"]+)"$/, function (locator) {
        return this.rightClick(locator);
    });

    this.Given(/^I fill field "([^"]+)" with "([^"]+)" $/, function (field, value) {
        return this.fillField(field, value);
    });

    this.Given(/^I append "([^"]+)" to field "([^"]+)" $/, function (value, field) {
        return this.appendField(field, value);
    });

    this.Given(/^I select "([^"]+)" in "([^"]+)"$/, function (option, select) {
        return this.selectOption(select, option);
    });

    this.Given(/^I attach file "([^"]+)" to "([^"]+)"$/, function (pathToFile, locator) {
        return this.attachFile(locator, pathToFile)
    });

    this.Given(/^I check option "([^"]+)"$/, function (field) {
        return this.checkOption(field);
    });

    this.Given(/^I check option "([^"]+)" in "([^"]+)"$/, function (field, context) {
        return this.checkOption(field, context);
    });

    this.Then(/^I don\'t see in title "([^"]+)"$/, function (text) {
        return this.dontSeeInTitle(text);
    });

    this.Then(/^I don\'t see "([^"]+)"$/, function (text) {
        return this.dontSee(text);
    });

    this.Then(/^I don\'t see "([^"]+)" within "([^"]+)"$/, function (text, context) {
        return this.dontSee(text, context);
    });

    this.Then(/^I see "([^"]+)" in field "([^"]+)"$/, function (value, field) {
        return this.seeInField(field, value);

    });

    this.Then(/^I don\'t see "([^"]+)" in field "([^"]+)"$/, function (value, field) {
        return this.dontSeeInField(field, value);

    });

    this.Then(/^I see checkbox "([^"]+)" is checked$/, function (field) {
        return this.seeCheckboxIsChecked(field);
    });

    this.Then(/^I don\'t see checkbox "([^"]+)" is checked$/, function (field) {
        return this.dontSeeCheckboxIsChecked(field);
    });

    this.Then(/^I see element "([^"]+)"$/, function (locator) {
        return this.seeElement(locator);
    });

    this.Then(/^I don\'t see element "([^"]+)"$/, function (locator) {
        return this.dontSeeElement(locator)
    });

    this.Then(/^I see element "([^"]+)" in DOM $/, function (locator) {
        return this.seeElementInDOM(locator);
    });

    this.Then(/^I don\'t see element "([^"]+)" in DOM $/, function (locator) {
        return this.dontSeeElementInDOM(locator);
    });

    this.Then(/^I see "([^"]+)" in source $/, function (text) {
        return this.seeInSource(text);
    });

    this.Then(/^I don\'t see "([^"]+)" in source $/, function (text) {
        return this.dontSeeInSource(text);
    });

    this.Then(/^I see "([^"]+)" elements in "([^"]+)"$/, function (num, selector) {
        return this.seeNumberOfElements(selector, num.toInteger());
    });

    this.Then(/^I see in current url "([^"]+)"$/, function (uri) {
        return this.seeInCurrentUrl(uri);
    });

    this.Then(/^I don\'t see in current url "([^"]+)"$/, function (uri) {
        return this.dontSeeInCurrentUrl(uri);
    });

    this.Then(/^I see current url equals "([^"]+)"$/, function (uri) {
        return this.seeCurrentUrlEquals(uri);
    });

    this.Then(/^I don\'t current url equals "([^"]+)"$/, function (uri) {
        return this.dontSeeCurrentUrlEquals(uri);
    });

    this.Then(/^I see "([^"]+)"$/, function (text) {
        return this.see(text);
    });

    this.Then(/^I see "([^"]+)" within "([^"]+)"$/, function (text, context) {
        return this.see(text, context);
    });

    this.When(/^within "([^"]+)"$/, function (locator) {
        return this._withinBegin(locator);
    });

    this.When(/^end within$/, function () {
        return this._withinEnd();
    });

    this.Given(/^I scroll to "locator"$/, function (locator) {
        return this.scrollTo(locator);
    });

    this.Given(/^I scroll to "([^"]+)" with offset "([^"]+)" "([^"]+)"$/, function (locator, offsetX, offsetY) {
        return this.scrollTo(locator, offsetX.toInteger(), offsetY.toInteger());
    });

    this.Given(/^I move cursor to "([^"]+)"$/, function (locator) {
        return this.moveCursorTo(locator);
    });

    this.Given(/^I move cursor to "([^"]+)" with offset "([^"]+)" "([^"]+)"$/, function (locator, offsetX, offsetY) {
        return this.moveCursorTo(locator, offsetX.toInteger(), offsetY.toInteger());
    });

    this.When(/^I save a screenshot to "([^"]+)"$/, function (pathToFile) {
        return this.saveScreenshot(pathToFile);
    });

    this.Given(/^I set cookie "([^"]+)"$/, function (cookie) {
        cookie = JSON.parse(cookie);
        return this.setCookie(cookie);
    });

    this.Given(/^I clear cookie "([^"]+)"$/, function (cookie) {
        return this.clearCookie(cookie);
    });

    this.Given(/^I clear field "([^"]+)"$/, function (locator) {
        return this.clearField(locator);
    });

    this.Then(/^I see cookie "([^"]+)"$/, function (name) {
        return this.seeCookie(name);
    });

    this.Then(/^I don\'t see cookie "([^"]+)"$/, function (name) {
        return this.dontSeeCookie(name);
    });

    this.Given(/^I accept popup$/, function () {
        return this.acceptPopup();
    });

    this.Given(/^I cancel popup$/, function () {
        return this.cancelPopup();
    });

    this.Then(/^I see "([^"]+)" in popup $/, function (text) {
        return this.seeInPopup(text);
    });

    this.Given(/^I press key "([^"]+)"$/, function (key) {
        return this.pressKey(key);
    });

    this.Given(/^I resize window to "([^"]+)" "([^"]+)"$/, function (width, height) {
        return this.resizeWindow(width.toInteger(), height.toInteger());
    });

    this.Given(/^I drag "([^"]+)" and drop to "([^"]+)"$/, function (srcElement, destElement) {
        return this.dragAndDrop(srcElement, destElement);
    });

    this.Given(/^I wait "([^"]+)" seconds$/, function (sec) {
        return this.wait(sec.toInteger());
    });

    this.Given(/^I wait "([^"]+)" seconds for element "([^"]+)"$/, function (sec, locator) {
        return this.waitForElement(locator, sec.toInteger());
    });

    this.Given(/^I wait "([^"]+)" seconds for text "([^"]+)"$/, function (sec, text) {
        return this.waitForText(text, sec.toInteger());
    });

    this.Given(/^I wait "([^"]+)" seconds for element "([^"]+)" to show$/, function (sec, locator) {
        return this.waitForVisible(locator, sec.toInteger());
    });

    this.Given(/^I wait "([^"]+)" seconds for element "([^"]+)" to hide$/, function (sec, locator) {
        return this.waitToHide(locator, sec.toInteger());
    });

    this.Given(/^I switch to "([^"]+)"$/, function (locator) {
        return this.switchTo(locator);
    });
};
