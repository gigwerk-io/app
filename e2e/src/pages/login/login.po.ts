import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {PageObjectBase} from '../../base.po';

export class LoginPage extends PageObjectBase {

  constructor() {
    super('/app/login');
  }

  async fieldIsRequired(id: string, text = '') {
    const el = element(by.id(id));
    await this.waitForSelector(el);
    return el.getText();
  }
}
