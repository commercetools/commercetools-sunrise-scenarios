package io.commercetools.sunrise.steps.ProductDetailPage;

import io.commercetools.sunrise.pages.ProductDetailPage;

import org.fluentlenium.core.annotation.Page;
import org.fluentlenium.cucumber.adapter.FluentCucumberTest;
import org.fluentlenium.cucumber.adapter.util.SharedDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import cucumber.api.java8.En;

@SharedDriver(type = SharedDriver.SharedType.PER_SCENARIO)
public class CommonStepDefs extends FluentCucumberTest implements En {
    @Page
    public static ProductDetailPage productDetailPage;

    @Override
    public WebDriver getDefaultDriver() {
        return new FirefoxDriver();
    }

    public CommonStepDefs () {
        Before(() -> {
            initFluent();
            initTest();
        });

        Given("I am on a product page", () -> {
            productDetailPage.goToRandomProduct(this);
            productDetailPage.isAt();
        });

        After(() -> {
            quit();
        });
    }
}
