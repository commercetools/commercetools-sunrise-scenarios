Feature: Cart
  Background: add a product to the cart
    Given I start a new session
    And I go to "/en/search"
    When I follow a product
    Then I should be on a product page
    When I add the product to cart
    Then I should be on a product page
    When I follow the mini cart
    Then I should be on "/en/cart"

  Scenario: Add item to cart
    Then the mini cart element should contain "1"

  Scenario: change quantity
    And I should see an ".input-number-increment" element
    When I press the ".input-number-increment" element
    Then the "quantity" field should contain "2"
    When I press "line-item-edit-button"
    Then the "quantity" field should contain "2"

  Scenario: remove line item
    When I press "line-item-delete-button"
    Then the mini cart element should contain "0"

  Scenario: continue shopping
    When I press "cart-continueshopping-btn-xs"
    Then I should be on the homepage
