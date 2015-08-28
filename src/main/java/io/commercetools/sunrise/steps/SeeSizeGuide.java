package io.commercetools.sunrise.steps;

import org.fluentlenium.cucumber.adapter.FluentCucumberTest;

import cucumber.api.java8.En;

public class SeeSizeGuide extends FluentCucumberTest implements En {
    public SeeSizeGuide() {

        When("I click on the size guide button", () -> {
            NavigationStepDefs.productDetailPage.clickOnSizeGuideButton();
        });

        Then("I should see a modal window containing international size conversions", () -> {
            NavigationStepDefs.productDetailPage.seeSizeGuideModal();
        });

    }
}
