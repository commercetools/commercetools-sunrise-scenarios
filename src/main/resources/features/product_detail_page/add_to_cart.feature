Feature: Add product to Cart
  The user should be able to add a product to his/her shopping cart.
  @wip  
  Scenario: Update cart quantity label
    Given I am on a product page
    When I choose a color for the product
    And I choose a size for the product
    And I click on the add to bag button
    Then I should see the cart quantity set to 1