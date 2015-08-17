libraryDependencies ++=
  "info.cukes" % "cucumber-java8" % "1.2.4" ::
    "org.assertj" % "assertj-core" % "3.1.0" ::
    "org.fluentlenium" % "fluentlenium-core" % "0.10.3" ::
    "org.seleniumhq.selenium" % "selenium-htmlunit-driver" % "2.47.1" ::
    "org.apache.httpcomponents" % "httpclient" % "4.4" :: //optional dependency of htmlunit, 4.5 not compatible with selenium 2.47.1
    "com.typesafe" % "config" % "1.3.0" ::
    Nil

mainClass := Some("io.commercetools.sunrise.steps.Main")