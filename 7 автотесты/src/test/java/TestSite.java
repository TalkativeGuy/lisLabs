import com.codeborne.selenide.ElementsCollection;
import com.codeborne.selenide.SelenideElement;
import com.codeborne.selenide.WebDriverConditions;
import com.codeborne.selenide.WebDriverRunner;
import org.junit.Assert;
import org.junit.Test;

import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;

public class TestSite {
    private SelenideElement ticketsMonthDropdown() {
        $(".dropdown #month").click();
        return
                $$("#afisha_filter_form .cart-filter__item").first()
                        .$(".dropdown-menu");
    }
    private SelenideElement ticketsMonthDropdownItem(int monthIndex) {
        return ticketsMonthDropdown()
                .$$(".abonement-list__title").get(monthIndex);
    }
    private SelenideElement ticketsOpenActivitiesDropdown() {
        $("#afisha_performance_list_container").click();
        return $("#afisha_performance_list_container .dropdown-menu");
    }
    private SelenideElement ticketsActiviesDropdowItem(int activityIndex) {
        return ticketsOpenActivitiesDropdown()
                .$$(".abonement-list__container .abonement-list__item")
                .get(activityIndex);
    }
    private ElementsCollection getAvailableSeats() {
        return $$("#schema svg path, #schema svg rect").filter(have(attribute("fill")));
    }

    @Test
    public void CompleteTest() throws InterruptedException {
		/// Открыть сайт, принять cookie
		open("https://novat.ru");
		if ($("#cookie-accept").isDisplayed()) $("#cookie-accept").click();
		$("[src^=\"/local/templates/novat_index/images/logo\"]").shouldBe(visible);

		/// Войти в аккаунт
		$("aside .additions__link").click();
		$("#auth-form").shouldBe(visible);
		$("#auth-form input[type='text']").setValue("vlazov_007@mail.ru");
		$("#auth-form input[type='password']").setValue("qwerty123");
		$("#forgot-form [type='submit']").click();

		/// Перейти к покупке билетов
		$("a[href=\"/buy_now/\"]").click();
		// webdriver().shouldHave(WebDriverConditions.url("https://novat.ru/buy_now"));

		/// Выбрать месяц
		SelenideElement monthDropdownItemEl = ticketsMonthDropdownItem(1).shouldBe(visible);
		String monthName = monthDropdownItemEl.text();
		monthDropdownItemEl.click();

		/// Выбрать жанр
		$("#genre_id").click();
		$$("#afisha_filter_form .cart-filter__item").get(1)
				.$(".dropdown-menu").shouldBe(visible)
				.$$(".abonement-list__item").get(2).click();

		/// Выбрать представление
		SelenideElement activiesDropdowItem = ticketsActiviesDropdowItem(2);
		activiesDropdowItem.shouldBe(visible).click();
		// проверка на то, что месяц выбранного представления соответствует выбранному месяцу
		String dateText = $("#afisha_performance_list_container .mobile-date").text();
		Pattern pDate = Pattern.compile(monthName.toLowerCase().substring(0,monthName.length()-2));
		Matcher mDate = pDate.matcher(dateText.toLowerCase());
		Assert.assertTrue(mDate.find());

		/// Выбрать свободное место
		for (int i=0; i<5; i++) $(".c-zoomBtns .c-zoomOut").click(); // чтобы было весь зал поместился
		ElementsCollection availableSeats = getAvailableSeats();
		SelenideElement headerCartFormEl = $("form[action=\"/cart/\"]");
		int sum = 0;
		int numOfSeats = 3;
		for (int i=0; i<numOfSeats; i++) {
			SelenideElement seatEl = availableSeats.get(i);
			seatEl.shouldBe(visible).click();
			String priceFromPopup = $("#place_info_line_1_row").text().replaceAll("\\D+","");
			sum += Integer.parseInt(priceFromPopup);
		// чтобы попап исчез и не мешал нажимать на другие места
			headerCartFormEl.click();
			headerCartFormEl.click();
		}
		// проверить, соответствует ли цена в корзине
		String priceFromCartForm = headerCartFormEl.$(".c-result-price").text().replaceAll("\\D+","");
		Assert.assertEquals(sum, Integer.parseInt(priceFromCartForm));

		/// Открыть корзину
		headerCartFormEl.click();
		ElementsCollection ticketItemEls = headerCartFormEl.$(".tickets-list").shouldBe(visible).$$(".ticket__item");
		Assert.assertEquals(ticketItemEls.size(), numOfSeats);

		/// Отменить одно из мест из брони
		ticketItemEls.get(0).$(".del_ticket").click();
		headerCartFormEl.click();
		ticketItemEls = headerCartFormEl.$(".tickets-list").shouldBe(visible).$$(".ticket__item");
		Assert.assertEquals(ticketItemEls.size(), numOfSeats - 1);

		/// Открыть страницу корзины
		headerCartFormEl.submit();
		webdriver().shouldHave(WebDriverConditions.url("https://novat.ru/cart/"));

		/// Попытаться оформить заказ без соглашения с правилами
		$("form[name=\"basket_form\"] .col-md-6 .text-right a").click();
		$(".final-information__float a").click();
		$("#agreement ~ .errorTxt span").shouldBe(visible);

		/// Согласиться с правилами и оформить
		$("label[for='agreement']").click();
		$(".final-information__float a").click();

		/// Аннулировать билет
		Thread.sleep(1000);
		$("aside a.additions__link").click();
		$("a[href=\"/cabinet/order\"]").click();
		$(".orders__item .cancel_order_link").shouldBe(visible).click();
		$("#cancel-order form").shouldBe(visible).submit();
		$(".orders__item .cancel_order_link").shouldNotBe(visible);

		/// Найти событие по поиску
		executeJavaScript("arguments[0].click()", $("aside a.search-icon"));
		SelenideElement searchForm = $("form[action=\"/search\"]");
		String searchPhrase = "Спящая";
		searchForm.$("input[type='text']").shouldBe(visible).setValue(searchPhrase);
		searchForm.submit();
		// $(".search-item__title").shouldBe(visible).should(matchText(searchPhrase));
		$$(".search-item__title").findBy(matchText(searchPhrase)).shouldBe(visible).click();

		/// Перейти к покупке билета на найденное событие
		$(".date_calendar__date").click();
		$(".date_calendar__btn").shouldBe(visible).click();
		Assert.assertTrue(WebDriverRunner.url().contains("novat.ru/buy_now"));

		/// Перейти к покупке билета из страницы "Афиша"
		$("a[href=\"/afisha/performances/\"]").click();
		$("#list .data-item__content .poster-item__info a").shouldBe(visible).click();

		/// Переключиться на другой язык
		SelenideElement langSwitchEl = $$("aside a").findBy(or("langButtonText", text("eng"), text("рус")));
		String prevLang = langSwitchEl.text();
		langSwitchEl.click();
		Assert.assertNotEquals(prevLang, langSwitchEl.text());

		/// Выйти из аккаунта
		$("aside .logout.additions__link").click();
		$("aside .logout.additions__link").shouldNotBe(visible);

		/// Открыть настройки для слабовидящих
		$("#sv_on").click();
		$("#sv_settings").shouldBe(visible);
    }
}

