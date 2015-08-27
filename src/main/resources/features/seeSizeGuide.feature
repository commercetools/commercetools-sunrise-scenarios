Feature: Product Size Guide
  The user should be able to see a size guide for all categories
  of products on the web shop in a modal window when he/she clicks 
  on the size guide button in the pdp (product detail page) of any product.
    
  @wip  
  Scenario: I can see the size guide for a product
    Given I am on a random product's pdp
    When I click on the size guide button
    Then I should see a modal window containing international size conversions