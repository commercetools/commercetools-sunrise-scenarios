Feature: home page

  Scenario: home page will be opened
    Given I navigate to "/"
    Then I see in title "Sunrise"

  Scenario: view new products
    Given I navigate to "/"
    And I scroll to ".home-viewall-btn" with offset "0" "100"
    And I click "View all new products"
    Then I see in current url "/en/new"
    And within "#form-filter-products .category-active"
    And I see "NEW"
    And end within
