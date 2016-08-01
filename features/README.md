This folder contains the acceptance tests for the Merchant Center Next Generation.

> If you are testing locally, make sure merchant center backend/frontend are running.

## Setup

```bash
# dependency are installed from the root folder
$ cd ~/dev/src/merchant-center-backend
$ npm i

# test locally using firefox
$ npm run test:features

# test locally using chrome
$ npm run test:features:local:chrome

# test against CI node
$ npm run test:features:local:ci

# test a specific feature
$ npm run test:features features/name-of-feature.feature

# to test a specific scenario in a feature, apply the line number where the scenario is defined
$ npm run test:features features/name-of-feature.feature:9

```

---

## Development

### Terminology

#### selector id
The __unique id__ to be targeted by the selenium driver. You set the selector id _per rendering element_ on the frontend project that is to be targeted by the feature defined in the backend project in a story driven test. The selector id in the frontend project is a `data-*` attribute.

__Example__: `<ul data-selector="menu-list"></ul>`  
It is important that the value of the __selector id__ is unique across the whole application and should not be given a context by its containing element.


### Example

__Given__ the following component is rendering in the __frontend__:

```js
const Menu = ({ props }) => {
  return (<ul data-selector="menu-list">{props.items.map((item, i) => (
      <MenuItem key={i} data-selector='menu-item' {...item}>))}</ul>)
}
```

You select the root element this using `findElement` in the webdriver:

```js
return this.driver.findElement(By.css('[data-selector=menu-list]'))
```


### Example (for lazy loading, or components that require time to render)

In cases where the scenario that you are writing includes waiting for components to finish their rendering phase,
you can and should halt the webdriver's execution of steps until the component can be located.

```js
return this.driver.wait(until.elementLocated(By.css('[data-selector=menu-list]')), this.timeout)
```


### Rules

- __DO NOT__ use CSS `.class` since selectors for targeting elements in a feature
- __USE__ `data-selector` to set a rendering element as a target for a feature

---

## Troubleshooting

### Debug Selenium Hub running on a docker container

If something goes wrong on CI, but it runs locally, you might want to debug locally using the docker container
that runs the selenium hub. The `selenium/standalone-firefox-debug` is an image that runs the hub with a firefox
browser installed on port `4444`. It also opens a port `5900` used to _see_ what's going on by connecting via `vnc`.

First, start the container in the background `./scripts/features_run_docker_debug`.
Then go to `Finder > Go > Connect to Server` and connect to `vnc://<DOCKER-IP>:5900` (you can get the docker ip by executing `docker-machine ip dev`). When prompted for a password, type `secret`.

Now you are connected to the selenium hub running inside the container. Just run the `npm run test:features:ci` task to see
your tests running against CI.

---

## Resources

- [cucumber](https://cucumber.io/)
- [Selenium Webdriver (node.js)](https://github.com/SeleniumHQ/selenium/tree/master/javascript/node)
- [Selenium Webdriver Documentation](http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver.html)
