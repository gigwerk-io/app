import { browser, element, by } from 'protractor';


export class Registration {

    unixTimeStamp = Math.round(new Date().getTime() / 1000);
    username = `2e2-${this.unixTimeStamp}`;
    firstNmae = 'e2e-user';
    lastName = 'test';
    email = `2e2-${this.unixTimeStamp}@gmail.com`;
    password = 'secret';
    phoneNumber = '9522221111';


    goToRegistrationPage() {
        browser.get('/signup');
    }

    restartBrowser() {
        browser.restart();
    }

    clickPersonalInformation() {

        element(by.xpath('/html/body/app-root/ion-app/ion-router-outlet/page-signup/ion-content/form/ion-list/ion-item[1]/ion-icon'))
            .click();
    }


    filloutPersonalInformation() {


        element(by.css('ion-input[name="first_name"] input')).sendKeys(this.firstNmae);
        element(by.css('ion-input[name="last_name"] input')).sendKeys(this.lastName);
        element(by.css('ion-input[name="username"] input')).sendKeys(this.username);
        element(by.css('ion-input[name="email"] input')).sendKeys(this.email);
        element(by.css('ion-input[name="phone"] input')).sendKeys(this.phoneNumber);
        element(by.id('long-button')).click();
        element(by.css('ion-input[name="password"] input')).sendKeys(this.password);
        element(by.css('ion-input[name="password-confirm"] input')).sendKeys(this.password);
        element(by.id('finish-personal')).click();
        element(by.id('select-city-Rochester')).click();
        element(by.id('submit-account')).click();

    }

    async wentToNextPage() {
        browser.waitForAngular();
        return browser.getCurrentUrl();
    }
}
