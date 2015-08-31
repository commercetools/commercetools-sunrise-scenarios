package io.commercetools.sunrise.steps.productdetailpage;

import cucumber.api.java8.En;

public class SeeSizeGuide implements En {
    public SeeSizeGuide() {

        When("I click on the size guide button", () -> {
            CommonStepDefs.productDetailPage.clickOnSizeGuideButton();
        });

        Then("I should see a modal window containing international size conversions", () -> {
            CommonStepDefs.productDetailPage.seeSizeGuideModal();
        });

    }
}
