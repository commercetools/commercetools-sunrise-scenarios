package io.commercetools.sunrise.steps.productdetailpage;

import cucumber.api.java8.En;

public class AddToCart implements En {


    public AddToCart() {
        When("I choose a color for the product", () -> {
            CommonStepDefs.productDetailPage.selectFirstColor();
        });

        And("I choose a size for the product", () -> {
            CommonStepDefs.productDetailPage.selectFirstColor();
        });

        And("I click on the add to bag button", () -> {
            CommonStepDefs.productDetailPage.clickAddToBag();
        });

        Then("I should see the cart quantity set to (\\d+)", (Integer expectedQuantity) -> {
            CommonStepDefs.productDetailPage.bagQuantityIsSetTo(expectedQuantity);
        });

    }
}
