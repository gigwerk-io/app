import {browser} from 'protractor';
import {RegistrationPage} from './registration.po';
import {timeout} from 'rxjs/operators';

describe('Registration', () => {
  const registrationPage = new RegistrationPage();

  beforeEach(() => {
    registrationPage.load();
  });

  afterEach(() => {
    registrationPage.restartBrowser();
  });

  it('should register new user', () => {
    const username = `2e2-${Math.round(new Date().getTime() / 1000)}`;
    registrationPage.selectPersonalInformation();
    registrationPage.enterInputByCss('ion-input[name="first_name"]', 'e2e-user');
    registrationPage.enterInputByCss('ion-input[name="last_name"]', 'test');
    registrationPage.enterInputByCss('ion-input[name="username"]', username);
    registrationPage.enterInputByCss('ion-input[name="email"]', `${username}@mail.com`);
    registrationPage.enterInputByCss('ion-input[name="phone"]', '9522221111');
    registrationPage.clickButton('long-button');
    registrationPage.enterInputByCss('ion-input[name="password"]', 'secret');
    registrationPage.enterInputByCss('ion-input[name="password-confirm"]', 'secret');
    registrationPage.clickButton('finish-personal');
    registrationPage.clickButton('select-city-Rochester');
    registrationPage.clickButton('submit-account');
    expect(registrationPage.wentToNextPage()).toBe(browser.baseUrl + 'app/tabs/marketplace');
  });

  it('should fail because user exists', () => {
    const username = 'admin';
    registrationPage.selectPersonalInformation();
    registrationPage.enterInputByCss('ion-input[name="first_name"]', 'fail-e2e-user');
    registrationPage.enterInputByCss('ion-input[name="last_name"]', 'testing');
    registrationPage.enterInputByCss('ion-input[name="username"]', username);
    registrationPage.enterInputByCss('ion-input[name="email"]', `${username}@mail.com`);
    registrationPage.enterInputByCss('ion-input[name="phone"]', '9522221111');
    registrationPage.clickButton('long-button');
    registrationPage.enterInputByCss('ion-input[name="password"]', 'secret');
    registrationPage.enterInputByCss('ion-input[name="password-confirm"]', 'secret');
    registrationPage.clickButton('finish-personal');
    registrationPage.clickButton('select-city-Rochester');
    registrationPage.clickButton('submit-account');
    expect(registrationPage.seeToast('color')).toBe('danger'); // present toast failure
  });
});
