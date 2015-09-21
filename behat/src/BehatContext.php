<?php

namespace Commercetools\Sunrise;

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Mink\Element\NodeElement;
use Behat\MinkExtension\Context\MinkContext;
use Symfony\Component\HttpFoundation\Request;

/**
 * @author @ct-jensschulze <jens.schulze@commercetools.de>
 */
class BehatContext extends MinkContext implements SnippetAcceptingContext
{
    protected $homepage;
    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct($homepage = '/')
    {
        $this->homepage = $homepage;
    }

    /**
     * @Given I navigate to :arg1
     */
    public function iNavigateTo($arg1)
    {
        $this->visit($arg1);
    }

    /**
     * @Then I see the text :arg1
     */
    public function iSeeTheText($arg1)
    {
        $this->assertPageContainsText($arg1);
    }

    /**
     * @Then the parameter :name should be :value
     */
    public function theParameterShouldBe($name, $value)
    {
        $request = $this->getRequestByUri($this->getSession()->getCurrentUrl());
        assertSame($value, $request->get($name));
    }

    /**
     * @Then the parameter :name should not be :value
     */
    public function theParameterShouldNotBe($name, $value)
    {
        $request = $this->getRequestByUri($this->getSession()->getCurrentUrl());
        assertNotSame($value, $request->get($name));
    }

    protected function getRequestByUri($uri)
    {
        return Request::create($uri);
    }

    /**
     * @Then /^the link "(?P<link>(?:[^"]|\\")*)" should have class "(?P<class>[^"]+)"$/
     */
    public function theLinkShouldHaveClass($link, $class)
    {
        $link = $this->getSession()->getPage()->findLink($link);
        $link->hasClass($class);
    }

    /**
     * @When /^(?:|I )follow the "(?P<element>[^"]*)" link$/
     * @When /^(?:|I )press the "(?P<element>[^"]*)" element/
     */
    public function clickPatternElement($element)
    {
        $element = $this->assertSession()->elementExists('css', $this->fixStepArgument($element));
        $element->click();
    }

    /**
     * @When /^(?:|I )add the product to cart$/
     */
    public function iAddTheProductToCart()
    {
        $element = $this->assertSession()->elementExists('css', '.add-to-bag');
        $element->click();
    }

    /**
     * @Given I start a new session
     */
    public function restartSession()
    {
        $this->getSession()->reset();
    }

    /**
     * @Given I wait for :seconds
     */
    public function waitFor($seconds)
    {
        $toWait = $seconds * 1000;
        $this->getSession()->wait($toWait);
    }

    /**
     * @When I follow a product
     */
    public function iFollowAProduct()
    {
        $this->clickLink('EUR');
    }

    /**
     * @Then I should be on a product page
     */
    public function iShouldBeOnAProductPage()
    {
        $this->assertUrlRegExp('"html$"');
    }

    /**
     * @When I follow the mini cart
     */
    public function iFollowTheMiniCart()
    {
        $this->clickPatternElement('.list-item-bag .link-your-bag');
    }

    /**
     * @Then the mini cart element should contain :arg1
     */
    public function theMiniCartElementShouldContain($arg1)
    {
        $this->assertElementContains('.list-item-bag .cart-item-number', $arg1);
    }

    public function assertHomepage()
    {
        $homepage = $this->homepage;
        if (!is_null($homepage)) {
            $this->assertPageAddress($homepage);
            return;
        }

        parent::assertHomepage();
    }

    /**
     * @When I click :arg1 at navigation
     */
    public function iClickAtNavigation($arg1)
    {
        $elements = $this->getSession()->getPage()->findAll('named', array(
            'link', $this->getSession()->getSelectorsHandler()->xpathLiteral('plus content'),
        ));
        /**
         * @var NodeElement $element
         */
        $arg1 = mb_strtolower($arg1);
        foreach ($elements as $element) {
            if (strpos(mb_strtolower($element->getText()), $arg1) !== false) {
                $element->click();
                break;
            }
        }
    }
}
