package io.commercetools.sunrise.steps;

import com.typesafe.config.ConfigFactory;
import cucumber.api.java8.En;
import org.fluentlenium.core.Fluent;
import org.fluentlenium.core.FluentAdapter;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import static org.assertj.core.api.Assertions.assertThat;


public class HomeStepDefs implements En {

    private final Fluent browser = new FluentAdapter(getWebDriver());

    private WebDriver getWebDriver() {
        return new HtmlUnitDriver();
    }

    private String baseUrl() {
        return ConfigFactory.load().getString("features.baseUrl");
    }

    public HomeStepDefs() {
        Given("I navigate to \"/(.*)\"", (final String path) -> {
            browser.goTo(baseUrl() + path);
        });

        Then("I see the text \"(.*)\"", (final String text) -> {
            assertThat(browser.pageSource()).contains(text);
        });
    }
}