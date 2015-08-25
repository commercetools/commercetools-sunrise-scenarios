package io.commercetools.sunrise.pages;
import org.fluentlenium.core.Fluent;
import org.fluentlenium.core.FluentPage;
import com.typesafe.config.ConfigFactory;

import static org.assertj.core.api.Assertions.assertThat;

public class PDP extends FluentPage {
	private String productUrl;
	private final String RANDOM_PRODUCT_URL = "/en/michael-kors-shopper-30H4GBFT6L-red-A0E2000000027AN.html";

	private String baseUrl() {
		return ConfigFactory.load().getString("features.baseUrl");
	}

	public String getProductUrl() {
		return productUrl == null ? "" : productUrl;
	}

	public void setProductUrl(String productUrl) {
		this.productUrl = productUrl;
	}

	public void goToRandomProduct(Fluent fluentTest) {
		this.productUrl = RANDOM_PRODUCT_URL;
		fluentTest.goTo(this);
	}

	public void clickOnSizeGuideButton() {
		find("#pdp-size-guide").first().click();
	}

	public void seeSizeGuideModal() {
		assertThat(findFirst("#size-guide").getAttribute("aria-hidden")).isNotNull();
		assertThat(findFirst("#size-guide").getAttribute("aria-hidden")).isEqualTo("false");
	}

	@Override
	public String getUrl() {
		return baseUrl() + getProductUrl();
	}

	@Override
	public void isAt() {
		findFirst(".pdp-page");
	}
}
