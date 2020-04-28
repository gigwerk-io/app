import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {PageObjectBase} from './base.po';

export class LoginPage extends PageObjectBase {

  constructor() {
    super('/login');
  }

  async clickButton() {
    const el = element(by.id('loginButton'));
    browser.wait(ExpectedConditions.elementToBeClickable(el), 200);
    el.click();
  }

  async seeTabs() {
    const el = element(by.tagName('ion-tab-bar'));
    await this.waitForSelector(el);
    return el.getAttribute('selected-tab');
  }

  urlChange(url) {
    return browser.getCurrentUrl().then(actualUrl => {
      return url !== actualUrl;
    });
  }

  async wentToNextPage() {
    browser.waitForAngular();
    return browser.getCurrentUrl();
  }

  async fieldIsRequired(id: string, text = '') {
    const el = element(by.id(id));
    await this.waitForSelector(el);
    return el.getText();
  }
}
