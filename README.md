# sphere-sunrise-scenarios
Cucumber tests for Sunrise

## Usage

* `sbt run` runs all cucumber tests for localhost:9000
* `sbt -Dfeatures.baseUrl="http://localhost:8080" run` runs all cucumber tests for localhost:8080
* `sbt "run home.feature"` runs only home feature
* the scenarios are in https://github.com/sphereio/sphere-sunrise-scenarios/tree/master/src/main/resources/features

## Usage with behat

### Install composer and requirements

* `curl -sS https://getcomposer.org/installer | php`
* `php composer.phar install`

### Setup selenium

* Download Selenium Server from the project website
* Run the server with the following command

  `$ java -jar selenium-server-standalone-2.44.0.jar`

### Execute tests

* `vendor/bin/behat`

### Profiles

There are some profiles predefined for different usages:

#### PHP

The sunrise php profile tries to access a local installed sunrise at http://127.0.0.1:8001

* `vendor/bin/behat -p php`

#### JVM

The sunrise jvm profile tries to access a local installed sunrise at http://127.0.0.1:9000

* `vendor/bin/behat -p jvm`

#### Live

The sunrise php profile tries to access a local installed sunrise at http://sunrise.commercetools.de

* `vendor/bin/behat -p live`
