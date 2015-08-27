package io.commercetools.sunrise.steps;

import io.commercetools.sunrise.pages.ProductDetailPage;
import org.fluentlenium.core.annotation.Page;
import org.fluentlenium.cucumber.adapter.FluentCucumberTest;
import org.fluentlenium.cucumber.adapter.util.SharedDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import cucumber.api.java8.En;

@SharedDriver(type = SharedDriver.SharedType.PER_SCENARIO)
public class SeeSizeGuide extends FluentCucumberTest implements En {

	@Page
	private ProductDetailPage pdp;

	@Override
	public WebDriver getDefaultDriver() {
		return new HtmlUnitDriver();
	}

	public SeeSizeGuide() {
		Before(()-> {
			this.initFluent();
			this.initTest();
		});

		Given("I am on a random product's pdp", () -> {
			pdp.goToRandomProduct(this);
			pdp.isAt();
        });

		When("I click on the size guide button", () -> {
			pdp.clickOnSizeGuideButton();
		});

		Then("I should see a modal window containing international size conversions", ()-> {
			pdp.seeSizeGuideModal();
		});

		After(()-> {
			this.quit();
		});

	}
}
