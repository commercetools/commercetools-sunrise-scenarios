package io.commercetools.sunrise.steps;

import org.fluentlenium.cucumber.adapter.FluentCucumberTest;

import cucumber.api.java8.En;

public class AddToCart extends FluentCucumberTest implements En {


    public AddToCart() {
        When("I choose a color for the product", () -> {
            NavigationStepDefs.productDetailPage.selectFirstColor();
        });

        And("I choose a size for the product", () -> {
            NavigationStepDefs.productDetailPage.selectFirstColor();
        });

        And("I click on the add to bag button", () -> {
            NavigationStepDefs.productDetailPage.clickAddToBag();
        });

        Then("I should see the cart quantity set to (\\d+)", (Integer expectedQuantity) -> {
            NavigationStepDefs.productDetailPage.bagQuantityIsSetTo(expectedQuantity);
        });

    }
}
