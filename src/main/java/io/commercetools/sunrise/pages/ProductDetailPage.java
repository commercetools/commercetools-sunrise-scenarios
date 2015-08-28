package io.commercetools.sunrise.pages;
import org.fluentlenium.core.Fluent;
import org.fluentlenium.core.FluentPage;
import org.fluentlenium.core.domain.FluentWebElement;
import org.openqa.selenium.support.FindBy;

import com.typesafe.config.ConfigFactory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.fluentlenium.core.filter.FilterConstructor.*;

public class ProductDetailPage extends FluentPage {
    private String productUrl;
    private String productName;
    private final String RANDOM_PRODUCT_URL = "/en/michael-kors-shopper-30H4GBFT6L-red-A0E2000000027AN.html";
    private final String RANDOM_PRODUCT_NAME = "SHOPPER „BEDFORD” MICHAEL KORS ROT";
    private final String PAGE_TITLE_PREFIX = "Sunrise -";
    public final String LANGUAGE_ENGLISH = "English";
    public final String LANGUAGE_GERMAN = "German";
    public final String LANGUAGE_FRENCH = "French";
    public final String COUNTRY_UK = "UK";
    public final String COUNTRY_GERMANY = "Germany";
    public final String COUNTRY_FRANCE = "France";

    // Page Elements
    // Header Elements

    @FindBy(css = "a.storeSelect")
    private FluentWebElement storeSelectorLink;

    @FindBy(css = "a.link-help")
    private FluentWebElement helpLink;

    @FindBy(css = "a.link-hotline")
    private FluentWebElement hotlineLink;

    @FindBy(css = "#pdp-language-select")
    private FluentWebElement languageSelect;

    @FindBy(css = "#pdp-country-select")
    private FluentWebElement countrySelect;

    @FindBy(css = "a.link-user")
    private FluentWebElement signInLink;

    @FindBy(css = "a.link-your-bag")
    private FluentWebElement shoppingCartLink;

    @FindBy(css = "span.cart-item-number")
    private FluentWebElement shoppingCartSizeLabel;

    // Navigation Elements

    @FindBy(css = "a.brand-logo")
    private FluentWebElement homePageLink;

    @FindBy(css = " #navigation > div:nth-child(2) > div > div > ul > li:nth-child(1) > a")
    private FluentWebElement newCategoryToggle;

    @FindBy(css = "#navigation > div:nth-child(2) > div > div > ul > li:nth-child(2) > a")
    private FluentWebElement womenCategoryToggle;

    @FindBy(css = "#navigation > div:nth-child(2) > div > div > ul > li:nth-child(3) > a")
    private FluentWebElement menCategoryToggle;

    @FindBy(css = "#navigation > div:nth-child(2) > div > div > ul > li:nth-child(4) > a")
    private FluentWebElement accessoriesCategoryToggle;

    @FindBy(css = "#navigation > div:nth-child(2) > div > div > ul > li:nth-child(5) > a")
    private FluentWebElement brandsCategoryToggle;

    @FindBy(css = "a.sale")
    private FluentWebElement saleLink;

    @FindBy(css ="#pdp-search-input")
    private FluentWebElement searchInput;

    // Product Details Section Elements

    @FindBy(css = "#pdp-view-details-btn")
    private FluentWebElement viewDetailsToggle;

    @FindBy(css = "#pdp-color-select")
    private FluentWebElement colorSelect;

    @FindBy(css = "#pdp-size-select")
    private FluentWebElement sizeSelect;

    @FindBy(css = "#pdp-size-guide")
    private FluentWebElement sizeGuideButton;

    @FindBy(css = "#size-guide")
    private FluentWebElement sizeGuide;

    @FindBy(css = "#pdp-bag-items-quantity-input")
    private FluentWebElement quantitySelect;

    @FindBy(css = "#pdp-add-to-bag-btn")
    private FluentWebElement addToCartButton;

    @FindBy(css = "#pdp-add-to-wishlist-btn")
    private FluentWebElement addToWishListButton;

    @FindBy(css = "#pdp-product-details-toggle")
    private FluentWebElement productDetailsAccordionToggle;

    @FindBy(css = "#pdp-delivery-returns-toggle")
    private FluentWebElement deliveryReturnsAccordionToggle;

    @FindBy(css = "#pdp-wishlist-btn")
    private FluentWebElement miniWishListButton;

    @FindBy(css = "#pdp-wishlist-view-btn")
    private FluentWebElement wishListButton;

    @FindBy(css = "div.wishlist-number")
    private FluentWebElement wishListQuantityDiv;

    // Reviews Section Elements

    @FindBy(css = "button.btn.write-review-btn")
    private FluentWebElement writeReviewButton;

    @FindBy(css = "button.btn.hidden-xs.showmore-reviews-btn")
    private FluentWebElement showMoreReviewsButton;


    private String baseUrl() {
        return ConfigFactory.load().getString("features.baseUrl");
    }

    public String getProductUrl() {
        return productUrl == null ? "" : productUrl;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void goToRandomProduct(Fluent fluentTest) {
        this.productUrl = RANDOM_PRODUCT_URL;
        this.productName = RANDOM_PRODUCT_NAME;
        fluentTest.goTo(this);
    }

    public void clickOnSizeGuideButton() {
        sizeGuideButton.click();
    }

    public void seeSizeGuideModal() {
        assertThat(sizeGuide.isDisplayed()).isTrue();
    }

    public void selectColor(String color) {
        colorSelect.find("option", withText(color)).click();
    }

    public void selectFirstColor() {
        colorSelect.findFirst("option").click();
    }

    public void selectSize(String size) {
        sizeSelect.findFirst("option", withText(size)).click();
    }

    public void selectFirstSize() {
        sizeSelect.findFirst("option").click();
    }

    @Override
    public String getUrl() {
        return baseUrl() + getProductUrl();
    }

    @Override
    public void isAt() {
        String expectedPageTitle = PAGE_TITLE_PREFIX + productName;
        assertThat(title().toLowerCase()).isEqualTo(expectedPageTitle.toLowerCase());
    }
}
