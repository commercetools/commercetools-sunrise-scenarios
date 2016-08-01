Feature: home page

  Scenario: home page will be opened
    Given I navigate to "/"
    Then I see in title "Sunrise"

  Scenario: view new products
    Given I navigate to "/"
    And I click "View all new products"
    Then I see in current url "/en/new"
    Then within "#form-filter-products .category-active"
    Then I see "NEW"
    Then end within
