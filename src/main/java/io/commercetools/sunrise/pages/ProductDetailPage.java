package io.commercetools.sunrise.pages;
import org.fluentlenium.core.Fluent;
import org.fluentlenium.core.FluentPage;
import org.fluentlenium.core.domain.FluentWebElement;

import com.typesafe.config.ConfigFactory;

import static org.assertj.core.api.Assertions.assertThat;

public class ProductDetailPage extends FluentPage {
	private String productUrl;
	private String productName;
	private final String RANDOM_PRODUCT_URL = "/en/michael-kors-shopper-30H4GBFT6L-red-A0E2000000027AN.html";
	private final String RANDOM_PRODUCT_NAME = "SHOPPER „BEDFORD” MICHAEL KORS ROT";
	private final String PAGE_TITLE_PREFIX = "Sunrise -";

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
	    findFirst(".size-guide-li").findFirst("a").click();
	}

	public void seeSizeGuideModal() {
		assertThat(findFirst("#size-guide").isDisplayed()).isTrue();
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
