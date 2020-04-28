import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';

export class PageObjectBase {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  load() {
    return browser.get(this.path);
  }

  async waitForSelector(el: ElementFinder) {
    return browser.wait(ExpectedConditions.presenceOf(el), 2000);
  }

  async enterInput(id: string, text: string) {
    const el = element(by.name(id));
    await this.waitForSelector(el);
    const inp = el.element(by.css('input'));
    inp.sendKeys(text);
  }

  async seeToast(attribute: string) {
    const el = element(by.tagName('ion-toast'));
    await this.waitForSelector(el);
    return el.getAttribute(attribute);
  }

  async enterTextareaText(id: string, text: string) {
    const el = element(by.id(id));
    await this.waitForSelector(el);
    const inp = el.element(by.css('textarea'));
    inp.sendKeys(text);
  }
}
