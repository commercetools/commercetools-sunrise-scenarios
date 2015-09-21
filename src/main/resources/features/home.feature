Feature: Home page

  Scenario: open page
    When I am on the homepage
    Then I should see "Sunrise"

  Scenario: view new products
    When I am on the homepage
    And I follow "View All New Products"
    Then I should be on "/en/new"
    Then I should see "New"
