import org.junit.Test;

import static com.codeborne.selenide.Selenide.*;

public class TestSelenide {
    @Test
    public void testGoogle(){
        open("https://www.google.ru/");
        $("#APjFqb").setValue("Бызов Владислав Евгеньевич").pressEnter();
    }
}