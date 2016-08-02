'use strict';

let withinStore = {};

const webdriver = require('webdriverio');
const configuration = require('../utils/configuration');
const stringIncludes = require('../../lib/assert/include').includes;
const urlEquals = require('../../lib/assert/equal').urlEquals;
const equals = require('../../lib/assert/equal').equals;
const empty = require('../../lib/assert/empty').empty;
const truth = require('../../lib/assert/truth').truth;
const xpathLocator = require('../../lib/utils').xpathLocator;
const fileExists = require('../../lib/utils').fileExists;
const assert = require('assert');
const path = require('path');
let debug = require('../../lib/output').debug;

function World() {
    // Everything defined in `this` instance will be available
    // in the `step_definitions` and `hooks`
    this.delay = 2 * 1000;
    this.timeout = 10 * 1000;
    this.fastTimeout = 1 * 1000;

    this.browser = null;
    this.options = {
        waitforTimeout: 1000, // ms
        desiredCapabilities: {},
        restart: true
    };

    // override defaults with config
    Object.assign(this.options, configuration.webdriverOptions);

    this.options.baseUrl = this.options.url || this.options.baseUrl;
    this.options.desiredCapabilities.browserName = this.options.browser || this.options.desiredCapabilities.browserName;
    this.options.waitforTimeout /= 1000; // convert to seconds

    this._beforeSuite = () => {
        if (!this.options.restart) {
            this.debugSection('Session', 'Starting singleton browser session');
            return this._startBrowser();
        }
    };

    this._startBrowser = () => {
        if (this.options.multiremote) {
            this.browser = webdriver.multiremote(this.options.multiremote);
        } else {
            this.browser = webdriver.remote(this.options).init();
        }
        if (this.options.windowSize === 'maximize') {
            this.browser.windowHandleMaximize(false);
        }
        if (this.options.windowSize && this.options.windowSize.indexOf('x') > 0) {
            let dimensions = this.options.windowSize.split('x');
            this.browser.windowHandleSize({width: dimensions[0], height: dimensions[1]});
        }
        return this.browser;
    };

    this._before = () => {
        if (this.options.restart) this._startBrowser();
        this.failedTestName = null;
        this.context = 'body';
        return this.browser;
    };

    this._after = () => {
        if (this.options.restart) return this.browser.close();
        this.debugSection('Session', 'cleaning cookies and localStorage');
        return this.browser.execute('localStorage.clear();').then(() => {
            return this.browser.deleteCookie();
        });
    };

    this._afterSuite = () => {
        if (!this.options.restart) return this.browser.close();
    };

    this._failed = (test) => {
        let fileName = test.getName().replace(/ /g, '_') + '.failed.png';
        return this.saveScreenshot(fileName);
    };

    this._withinBegin = (locator) => {
        withinStore.elFn = this.browser.element;
        withinStore.elsFn = this.browser.elements;
        this.context = locator;
        return this.browser.element(withStrictLocator(locator)).then((res) => {
            this.browser.element = function (l) {
                return this.elementIdElement(res.value.ELEMENT, l);
            };
            this.browser.elements = function (l) {
                return this.elementIdElements(res.value.ELEMENT, l);
            };
        });
    };

    this._withinEnd = () => {
        if (withinStore.elFn) {
            this.context = 'body';
            this.browser.element = withinStore.elFn;
            this.browser.elements = withinStore.elsFn;
            withinStore.elFn = null;
            withinStore.elsFn = null;
        }
    };

    /**
     * Get elements by different locator types, including strict locator
     * Should be used in custom helpers:
     *
     * ```js
     * this.helpers['WebDriverIO']._locate({name: 'password'}).then //...
     * ```
     */
    this._locate = (locator) => {
        return this.browser.elements(withStrictLocator(locator));
    };

    /**
     * Find a checkbox by providing human readable text:
     *
     * ```js
     * this.helpers['WebDriverIO']._locateCheckable('I agree with terms and conditions').then // ...
     * ```
     */
    this._locateCheckable = (locator) => {
        return findCheckable(this.browser, locator).then(function (res) {
            return res.value;
        })
    };

    /**
     * Find a clickable element by providing human readable text:
     *
     * ```js
     * this.helpers['WebDriverIO']._locateClickable('Next page').then // ...
     * ```
     */
    this._locateClickable = (locator) => {
        return findClickable(this.browser, locator).then(function (res) {
            return res.value;
        })
    };

    /**
     * Find field elements by providing human readable text:
     *
     * ```js
     * this.helpers['WebDriverIO']._locateFields('Your email').then // ...
     * ```
     */
    this._locateFields = (locator) => {
        return findFields(this.browser, locator).then(function (res) {
            return res.value;
        })
    };

    /**
     * {{> ../webapi/amOnPage }}
     */
    this.amOnPage = (url) => {
        return this.browser.url(url).url((err, res) => {
            if (err) throw err;
            this.debugSection('Url', res.value);
        });
    };

    /**
     * {{> ../webapi/click }}
     */
    this.click = (locator, context) => {
        let client = this.browser;
        let clickMethod = this.browser.isMobile ? 'touchClick' : 'elementIdClick';
        if (context) {
            client = client.element(context);
        }
        return findClickable(client, locator).then(function (res) {
            if (!res.value || res.value.length === 0) {
                if (typeof(locator) === "object") locator = JSON.stringify(locator);
                throw new Error(`Clickable element ${locator.toString()} was not found by text|CSS|XPath`);
            }
            let elem = res.value[0];
            return this[clickMethod](elem.ELEMENT);
        });
    };

    /**
     * {{> ../webapi/doubleClick }}
     */
    this.doubleClick = (locator, context) => {
        let client = this.browser;
        if (context) {
            client = client.element(context);
        }
        return findClickable(client, locator).then(function (res) {
            if (!res.value || res.value.length === 0) {
                if (typeof(locator) === "object") locator = JSON.stringify(locator);
                throw new Error(`Clickable element ${locator.toString()} was not found by text|CSS|XPath`);
            }
            let elem = res.value[0];
            return this.moveTo(elem.ELEMENT).doDoubleClick();
        });
    };

    /**
     * Performs right click on an element matched by CSS or XPath.
     */
    this.rightClick = (locator) => {
        return this.browser.rightClick(withStrictLocator(locator));
    };

    /**
     * {{> ../webapi/fillField }}
     */
    this.fillField = (field, value) => {
        return findFields(this.browser, field).then(function (res) {
            if (!res.value || res.value.length === 0) {
                throw new Error(`Field ${field} not found by name|text|CSS|XPath`);
            }
            let elem = res.value[0];
            return this.elementIdClear(elem.ELEMENT).elementIdValue(elem.ELEMENT, value);
        });
    };

    /**
     * {{> ../webapi/appendField }}
     */
    this.appendField = (field, value) => {
        return findFields(this.browser, field).then(function (res) {
            if (!res.value || res.value.length === 0) {
                throw new Error(`Field ${field} not found by name|text|CSS|XPath`);
            }
            let elem = res.value[0];
            return this.elementIdValue(elem.ELEMENT, value);
        });
    };

    /**
     * {{> ../webapi/selectOption}}
     *
     */
    this.selectOption = (select, option) => {
        return findFields(this.browser, select).then(function (res) {
            if (!res.value || res.value.length === 0) {
                throw new Error(`Selectable field ${select} not found by name|text|CSS|XPath`);
            }
            let elem = res.value[0];

            let normalized, byVisibleText;
            let commands = [];

            if (!Array.isArray(option)) {
                option = [option];
            }

            option.forEach((opt) => {
                normalized = `[normalize-space(.) = "${opt.trim() }"]`;
                byVisibleText = `./option${normalized}|./optgroup/option${normalized}`;
                commands.push(this.elementIdElements(elem.ELEMENT, byVisibleText));
            });
            return this.unify(commands, {extractValue: true}).then((els) => {
                commands = [];
                let clickOptionFn = (el) => {
                    if (el[0]) el = el[0];
                    if (el && el.ELEMENT) commands.push(this.elementIdClick(el.ELEMENT));
                };

                if (els.length) {
                    els.forEach(clickOptionFn);
                    return this.unify(commands);
                }
                let normalized, byValue;

                option.forEach((opt) => {
                    normalized = `[normalize-space(@value) = "${opt.trim() }"]`;
                    byValue = `./option${normalized}|./optgroup/option${normalized}`;
                    commands.push(this.elementIdElements(elem.ELEMENT, byValue));
                });
                // try by value
                return this.unify(commands, {extractValue: true}).then((els) => {
                    if (els.length === 0) {
                        throw new Error(`Option ${option} in ${select} was found neither by visible text not by value`);
                    }
                    commands = [];
                    els.forEach(clickOptionFn);
                    return this.unify(commands);
                });
            });
        });
    };

    /**
     * {{> ../webapi/attachFile }}
     */
    this.attachFile = (locator, pathToFile) => {
        let file = path.join(global.codecept_dir, pathToFile);
        if (!fileExists(file)) {
            throw new Error(`File at ${file} can not be found on local system`);
        }
        return findFields(this.browser, locator).then((el) => {
            this.browser.uploadFile(file).then((res) => {
                if (!el.length) {
                    throw new Error(`File field ${locator} not found by name|text|CSS|XPath`);
                }
                return this.browser.elementIdValue(el[0].ELEMENT, res.value);
            });
        });
    };

    /**
     * {{> ../webapi/checkOption }}
     */
    this.checkOption = (field, context) => {
        let client = this.browser;
        let clickMethod = this.browser.isMobile ? 'touchClick' : 'elementIdClick';
        if (context) {
            client = client.element(withStrictLocator(context));
        }
        return findCheckable(client, field).then((res) => {
            if (!res.value || res.value.length === 0) {
                throw new Error(`Checkable ${field} cant be located by name|text|CSS|XPath`);
            }
            let elem = res.value[0];
            return client.elementIdSelected(elem.ELEMENT).then(function (isSelected) {
                if (isSelected.value) return true;
                return this[clickMethod](elem.ELEMENT);
            });
        });
    };

    /**
     * {{> ../webapi/grabTextFrom }}
     */
    this.grabTextFrom = (locator) => {
        return this.browser.getText(withStrictLocator(locator)).then(function (text) {
            return text;
        });
    };

    /**
     * Retrieves the innerHTML from an element located by CSS or XPath and returns it to test.
     * Resumes test execution, so **should be used inside a generator with `yield`** operator.
     *
     * ```js
     * let postHTML = yield I.grabHTMLFrom('#post');
     * ```
     */
    this.grabHTMLFrom = (locator) => {
        return this.browser.getHTML(withStrictLocator(locator)).then(function (html) {
            return html;
        });
    };

    /**
     * {{> ../webapi/grabValueFrom }}
     */
    this.grabValueFrom = (locator) => {
        return this.browser.getValue(withStrictLocator(locator)).then(function (text) {
            return text;
        });
    };

    /**
     * {{> ../webapi/grabAttributeFrom }}
     */
    this.grabAttributeFrom = (locator, attr) => {
        return this.browser.getAttribute(withStrictLocator(locator), attr).then(function (text) {
            return text;
        });
    };

    /**
     * {{> ../webapi/seeInTitle }}
     */
    this.seeInTitle = (text) => {
        return this.browser.getTitle().then((title) => {
            return stringIncludes('web page title').assert(text, title);
        });
    };

    /**
     * {{> ../webapi/dontSeeInTitle }}
     */
    this.dontSeeInTitle = (text) => {
        return this.browser.getTitle().then((title) => {
            return stringIncludes('web page title').negate(text, title);
        });
    };

    /**
     * {{> ../webapi/grabTitle }}
     */
    this.grabTitle = () => {
        return this.browser.getTitle().then((title) => {
            this.debugSection('Title', title);
            return title;
        });
    };

    /**
     * {{> ../webapi/see }}
     */
    this.see = (text, context) => {
        return proceedSee.call(this, 'assert', text, context);
    };

    /**
     * {{> ../webapi/dontSee }}
     */
    this.dontSee = (text, context) => {
        return proceedSee.call(this, 'negate', text, context);
    };

    /**
     * {{> ../webapi/seeInField }}
     */
    this.seeInField = (field, value) => {
        return proceedSeeField.call(this, 'assert', field, value);
    };

    /**
     * {{> ../webapi/dontSeeInField }}
     */
    this.dontSeeInField = (field, value) => {
        return proceedSeeField.call(this, 'negate', field, value);
    };

    /**
     * {{> ../webapi/seeCheckboxIsChecked }}
     */
    this.seeCheckboxIsChecked = (field) => {
        return proceedSeeCheckbox.call(this, 'assert', field);
    };

    /**
     * {{> ../webapi/dontSeeCheckboxIsChecked }}
     */
    this.dontSeeCheckboxIsChecked = (field) => {
        return proceedSeeCheckbox.call(this, 'negate', field);
    };

    /**
     * {{> ../webapi/seeElement }}
     */
    this.seeElement = (locator) => {
        return this.browser.isVisible(withStrictLocator(locator)).then(function (res) {
            return truth(`elements of ${locator}`, 'to be seen').assert(res);
        });
    };

    /**
     * {{> ../webapi/dontSeeElement}}
     */
    this.dontSeeElement = (locator) => {
        return this.browser.isVisible(withStrictLocator(locator)).then(function (res) {
            return truth(`elements of ${locator}`, 'to be seen').negate(res);
        });
    };

    /**
     * {{> ../webapi/seeElementInDOM }}
     */
    this.seeElementInDOM = (locator) => {
        return this.browser.elements(withStrictLocator(locator)).then(function (res) {
            return empty('elements').negate(res.value);
        });
    };

    /**
     * {{> ../webapi/dontSeeElementInDOM }}
     */
    this.dontSeeElementInDOM = (locator) => {
        return this.browser.elements(withStrictLocator(locator)).then(function (res) {
            return empty('elements').assert(res.value);
        });
    };

    /**
     * {{> ../webapi/seeInSource }}
     */
    this.seeInSource = (text) => {
        return this.browser.getSource().then((source) => {
            return stringIncludes('HTML source of a page').assert(text, source);
        });
    };

    /**
     * {{> ../webapi/dontSeeInSource }}
     */
    this.dontSeeInSource = (text) => {
        return this.browser.getSource().then((source) => {
            return stringIncludes('HTML source of a page').negate(text, source);
        });
    };

    /**
     * asserts that an element appears a given number of times in the DOM
     * Element is located by label or name or CSS or XPath.
     *
     * ```js
     * I.seeNumberOfElements('#submitBtn', 1);
     * ```
     */
    this.seeNumberOfElements = (selector, num) => {
        return this.browser.elements(withStrictLocator(selector))
            .then(function (res) {
                return assert.equal(res.value.length, num);
            });
    };

    /**
     * {{> ../webapi/seeInCurrentUrl }}
     */
    this.seeInCurrentUrl = (url) => {
        return this.browser.url().then(function (res) {
            return stringIncludes('url').assert(url, res.value);
        });
    };

    /**
     * {{> ../webapi/dontSeeInCurrentUrl }}
     */
    this.dontSeeInCurrentUrl = (url) => {
        return this.browser.url().then(function (res) {
            return stringIncludes('url').negate(url, res.value);
        });
    };

    /**
     * {{> ../webapi/seeCurrentUrlEquals }}
     */
    this.seeCurrentUrlEquals = (url) => {
        return this.browser.url().then((res) => {
            return urlEquals(this.options.url).assert(url, res.value);
        });
    };

    /**
     * {{> ../webapi/dontSeeCurrentUrlEquals }}
     */
    this.dontSeeCurrentUrlEquals = (url) => {
        return this.browser.url().then((res) => {
            return urlEquals(this.options.url).negate(url, res.value);
        });
    };

    /**
     * {{> ../webapi/executeScript }}
     */
    this.executeScript = (fn) => {
        return this.browser.execute.apply(this.browser, arguments);
    };

    /**
     * {{> ../webapi/executeAsyncScript }}
     */
    this.executeAsyncScript = (fn) => {
        return this.browser.executeAsync.apply(this.browser, arguments);
    };

    /**
     * Scrolls to element matched by locator.
     * Extra shift can be set with offsetX and offsetY options
     *
     * ```js
     * I.scrollTo('footer');
     * I.scrollTo('#submit', 5,5);
     * ```
     */
    this.scrollTo = (locator, offsetX, offsetY) => {
        return this.browser.scroll(withStrictLocator(locator), offsetX, offsetY);
    };

    /**
     * Moves cursor to element matched by locator.
     * Extra shift can be set with offsetX and offsetY options
     *
     * ```js
     * I.moveCursorTo('.tooltip');
     * I.moveCursorTo('#submit', 5,5);
     * ```
     */
    this.moveCursorTo = (locator, offsetX, offsetY) => {
        return this.browser.moveToObject(withStrictLocator(locator), offsetX, offsetY);
    };

    /**
     * {{> ../webapi/saveScreenshot}}
     */
    this.saveScreenshot = (fileName) => {
        let outputFile = path.join(path.resolve(this.options.outputDir), fileName);
        this.debug('Screenshot has been saved to ' + outputFile);
        return this.browser.saveScreenshot(outputFile);
    };

    /**
     * {{> ../webapi/setCookie}}
     *
     * Uses Selenium's JSON [cookie format](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     */
    this.setCookie = (cookie) => {
        return this.browser.setCookie(cookie);
    };

    /**
     * {{> ../webapi/clearCookie}}
     */
    this.clearCookie = (cookie) => {
        return this.browser.deleteCookie(cookie);
    };

    /**
     * {{> ../webapi/clearField}}
     */
    this.clearField = (locator) => {
        return this.browser.clearElement(withStrictLocator(locator));
    };

    /**
     * {{> ../webapi/seeCookie}}
     */
    this.seeCookie = (name) => {
        return this.browser.getCookie(name).then(function (res) {
            return truth('cookie ' + name, 'to be set').assert(res);
        });
    };

    /**
     * {{> ../webapi/dontSeeCookie}}
     */
    this.dontSeeCookie = (name) => {
        return this.browser.getCookie(name).then(function (res) {
            return truth('cookie ' + name, 'to be set').negate(res);
        });
    };

    /**
     * {{> ../webapi/grabCookie}}
     */
    this.grabCookie = (name) => {
        return this.browser.getCookie(name);
    };

    /**
     * Accepts the active JavaScript native popup window, as created by window.alert|window.confirm|window.prompt.
     * Don't confuse popups with modal windows, as created by [various libraries](http://jster.net/category/windows-modals-popups).
     */
    this.acceptPopup = () => {
        return this.browser.alertText().then(function (res) {
            if (res !== null) {
                return this.alertAccept();
            }
        });
    };

    /**
     * Dismisses the active JavaScript popup, as created by window.alert|window.confirm|window.prompt.
     */
    this.cancelPopup = () => {
        return this.browser.alertText().then(function (res) {
            if (res !== null) {
                return this.alertDismiss();
            }
        });
    };

    /**
     * Checks that the active JavaScript popup, as created by `window.alert|window.confirm|window.prompt`, contains the given string.
     */
    this.seeInPopup = (text) => {
        return this.browser.alertText().then(function (res) {
            if (res === null) {
                throw new Error('Popup is not opened');
            }
            stringIncludes('text in popup').assert(text, res);
        });
    };

    /**
     * {{> ../webapi/pressKey }}
     *
     * To make combinations with modifier and mouse clicks (like Ctrl+Click) press a modifier, click, then release it.
     *
     * ```js
     * I.pressKey('Control');
     * I.click('#someelement');
     * I.pressKey('Control');
     * ```
     */
    this.pressKey = (key) => {
        let modifier;
        if (Array.isArray(key) && ~['Control', 'Command', 'Shift', 'Alt'].indexOf(key[0])) {
            modifier = key[0];
        }
        return this.browser.keys(key).then(function () {
            if (!modifier) return true;
            return this.keys(modifier); // release modifeier
        });
    };

    /**
     * {{> ../webapi/resizeWindow }}
     */
    this.resizeWindow = (width, height) => {
        if (width === 'maximize') {
            return this.browser.windowHandleMaximize(false);
        }
        return this.browser.windowHandleSize({width, height});
    };

    /**
     * Drag an item to a destination element.
     *
     * ```js
     * I.dragAndDrop('#dragHandle', '#container');
     * ```
     */
    this.dragAndDrop = (srcElement, destElement) => {
        return this.browser.dragAndDrop(
            withStrictLocator(srcElement),
            withStrictLocator(destElement)
        );
    };

    /**
     * {{> ../webapi/wait }}
     */
    this.wait = (sec) => {
        return this.browser.pause(sec * 1000);
    };

    /**
     * {{> ../webapi/waitForEnabled }}
     */
    this.waitForEnabled = (locator, sec) => {
        sec = sec || this.options.waitForTimeout;
        return this.browser.waitForEnabled(withStrictLocator(locator), sec * 1000);
    };

    /**
     * {{> ../webapi/waitForElement }}
     */
    this.waitForElement = (locator, sec) => {
        sec = sec || this.options.waitForTimeout;
        return this.browser.waitForExist(withStrictLocator(locator), sec * 1000);
    };

    /**
     * {{> ../webapi/waitForText }}
     */
    this.waitForText = (text, sec, context) => {
        sec = sec || this.options.waitForTimeout;
        context = context || 'body';
        return this.browser.waitUntil(function () {
            return this.getText(context).then(function (source) {
                if (Array.isArray(source)) {
                    return source.filter(part => part.indexOf(text) >= 0).length > 0;
                }
                return source.indexOf(text) >= 0;
            });
        }, sec * 1000)
            .catch((e) => {
                if (e.type === 'WaitUntilTimeoutError') {
                    return proceedSee.call(this, 'assert', text, context);
                } else {
                    throw e;
                }
            });
    };

    /**
     * {{> ../webapi/waitForVisible }}
     */
    this.waitForVisible = (locator, sec) => {
        sec = sec || this.options.waitForTimeout;
        return this.browser.waitForVisible(withStrictLocator(locator), sec * 1000);
    };

    /**
     * Waits for an element to become invisible on a page (by default waits for 1sec).
     * Element can be located by CSS or XPath.
     */
    this.waitToHide = (locator, sec) => {
        sec = sec || this.options.waitForTimeout;
        return this.browser.waitForVisible(withStrictLocator(locator), sec * 1000, true);
    };

    /**
     * Waits for a this.to return true (waits for 1sec by default).
     */
    this.waitUntil = (fn, sec) => {
        sec = sec || this.options.waitForTimeout;
        return this.browser.waitUntil(fn, sec);
    };

    /**
     * Switches frame or in case of null locator reverts to parent.
     */
    this.switchTo = (locator) => {
        locator = locator || null;
        return this.browser.frame(locator);
    };

    this.debug = (msg) => {
        debug(msg);
    };

    this.debugSection = (section, msg) => {
        debug(`[${section}] ${msg}`);
    };
}

function proceedSee(assertType, text, context) {
    let description;
    if (!context) {
        context = this.context;
        if (this.context === 'body') {
            description = 'web page';
        } else {
            description = 'current context ' + this.context;
        }
    } else {
        description = 'element ' + context;
    }
    return this.browser.getText(withStrictLocator(context)).then(function (source) {
        return stringIncludes(description)[assertType](text, source);
    });
}

function findClickable(client, locator) {
    if (typeof (locator) === 'object') return client.elements(withStrictLocator(locator));
    if (isCSSorXPathLocator(locator)) return client.elements(locator);

    let literal = xpathLocator.literal(locator);

    let narrowLocator = xpathLocator.combine([
        `.//a[normalize-space(.)=${literal}]`,
        `.//button[normalize-space(.)=${literal}]`,
        `.//a/img[normalize-space(@alt)=${literal}]/ancestor::a`,
        `.//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][normalize-space(@value)=${literal}]`
    ]);
    return client.elements(narrowLocator).then(function (els) {
        if (els.value.length) {
            return els;
        }
        let wideLocator = xpathLocator.combine([
            `.//a[./@href][((contains(normalize-space(string(.)), ${literal})) or .//img[contains(./@alt, ${literal})])]`,
            `.//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][contains(./@value, ${literal})]`,
            `.//input[./@type = 'image'][contains(./@alt, ${literal})]`,
            `.//button[contains(normalize-space(string(.)), ${literal})]`,
            `.//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][./@name = ${literal}]`,
            `.//button[./@name = ${literal}]`
        ]);
        return client.elements(wideLocator).then(function (els) {
            if (els.value.length) {
                return els;
            }
            return client.elements(locator); // by css or xpath
        });
    });
}

function findFields(client, locator) {
    if (typeof (locator) === 'object') return client.elements(withStrictLocator(locator));
    if (isCSSorXPathLocator(locator)) return client.elements(locator);

    let literal = xpathLocator.literal(locator);
    let byText = xpathLocator.combine([
        `.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')][(((./@name = ${literal}) or ./@id = //label[contains(normalize-space(string(.)), ${literal})]/@for) or ./@placeholder = ${literal})]`,
        `.//label[contains(normalize-space(string(.)), ${literal})]//.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')]`
    ]);
    return client.elements(byText).then((els) => {
        if (els.value.length) return els;
        let byName = `.//*[self::input | self::textarea | self::select][@name = ${literal}]`;
        return client.elements(byName).then((els) => {
            if (els.value.length) return els;
            return client.elements(locator); // by css or xpath
        });
    });
}

function proceedSeeField(assertType, field, value) {
    return findFields(this.browser, field).then(function (res) {
        if (!res.value || res.value.length === 0) {
            throw new Error(`Field ${field} not found by name|text|CSS|XPath`);
        }

        var proceedMultiple = (fields) => {
            let commands = [];
            fields.forEach((el) => commands.push(this.elementIdSelected(el.ELEMENT)));
            this.unify(commands).then((res) => {
                commands = [];
                fields.forEach((el) => {
                    if (el.value === false) return;
                    commands.push(this.elementIdAttribute(el.ELEMENT, 'value'));
                });
                this.unify(commands, {extractValue: true}).then((val) => {
                    return stringIncludes('fields by ' + field)[assertType](value, val);
                });
            });
        }

        var proceedSingle = (el) => {
            return this.elementIdAttribute(el.ELEMENT, 'value').then((res) => {
                return stringIncludes('fields by ' + field)[assertType](value, res.value);
            });
        }

        return this.elementIdName(res.value[0].ELEMENT).then((tag) => {
            if (tag.value == 'select') {
                return proceedMultiple(res.value);
            }

            if (tag.value == 'input') {
                return this.elementIdAttribute(res.value[0].ELEMENT, 'type').then((type) => {
                    if (type.value == 'checkbox' || type.value == 'radio') {
                        return proceedMultiple(res.value);
                    }
                    return proceedSingle(res.value[0]);
                });
            }
            return proceedSingle(res.value[0]);
        });
    });
}

function proceedSeeCheckbox(assertType, field) {
    return findFields(this.browser, field).then(function (res) {
        if (!res.value || res.value.length === 0) {
            throw new Error(`Field ${field} not found by name|text|CSS|XPath`);
        }
        let commands = [];
        res.value.forEach((el) => commands.push(this.elementIdSelected(el.ELEMENT)));
        return this.unify(commands, {extractValue: true}).then((selected) => {
            return truth(`checkable field ${field}`, 'to be checked')[assertType](selected);
        });
    });
}

function findCheckable(client, locator) {
    if (typeof (locator) === 'object') return client.elements(withStrictLocator(locator));
    if (isCSSorXPathLocator(locator)) return client.elements(locator);

    let literal = xpathLocator.literal(locator);
    let byText = xpathLocator.combine([
        `.//input[@type = 'checkbox' or @type = 'radio'][(@id = //label[contains(normalize-space(string(.)), ${literal})]/@for) or @placeholder = ${literal}]`,
        `.//label[contains(normalize-space(string(.)), ${literal})]//input[@type = 'radio' or @type = 'checkbox']`
    ]);
    return client.elements(byText).then(function (els) {
        if (els.value.length) return els;
        let byName = `.//input[@type = 'checkbox' or @type = 'radio'][@name = ${literal}]`;
        return client.elements(byName).then(function (els) {
            if (els.value.length) return els;
            return client.elements(locator); // by css or xpath
        });
    });
}

function isCSSorXPathLocator(locator) {
    if (locator[0] === '#' || locator[0] === '.') {
        return true;
    }
    if (locator.substr(0, 2) === '//') {
        return true;
    }
    return false;
}

function withStrictLocator(locator) {
    if (!locator) return null;
    if (typeof (locator) !== 'object') return locator;
    let key = Object.keys(locator)[0];
    let value = locator[key];

    locator.toString = () => `{${key}: '${value}'}`;

    switch (key) {
        case 'by':
        case 'xpath':
        case 'css':
            return value;
        case 'id':
            return '#' + value;
        case 'name':
            return `[name="${value}"]`;
    }
}

module.exports = function world() {
    this.World = World;
};