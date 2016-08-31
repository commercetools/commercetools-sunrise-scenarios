Feature: home page

  Scenario: home page will be opened
    Given I navigate to "/"
    Then I see an image at "picture .img-responsive"

  Scenario: view new products
    Given I navigate to "/"
    And I scroll to ".home-viewall-btn" with offset "0" "100"
    And I click "View all new products"
    Then I see in current url "/en/new"
    And within ".jumbotron"
    And I see "NEW"
    And end within
