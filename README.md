# sphere-sunrise-scenarios
Cucumber tests for Sunrise

## Usage

* `sbt run` runs all cucumber tests for localhost:9000
* `sbt -Dfeatures.baseUrl="http://localhost:8080" run` runs all cucumber tests for localhost:8080
* `sbt "run home.feature"` runs only home feature