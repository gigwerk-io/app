import {browser, element, by} from 'protractor';
import {PageObjectBase} from '../../base.po';


export class RegistrationPage extends PageObjectBase {
  constructor() {
    super('/signup');
  }

  selectPersonalInformation() {
    const el = element(by.id('personal-info-icon'));
    this.waitForSelector(el);
    el.click();
  }


}
