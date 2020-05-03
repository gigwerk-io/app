import {LoginPage} from './login.po';
import {browser} from 'protractor';


describe('login page', () => {
  const page = new LoginPage();

  beforeEach(() => {
    page.load();
  });

  afterEach(() => {
    page.restartBrowser();
  });

  it('should validate the form', () => {
    page.load();
    page.clickButton('loginButton');
    expect(page.fieldIsRequired('usernameRequired')).toBe('Username is required');
    expect(page.fieldIsRequired('passwordRequired')).toBe('Password is required');
  });

  it('should fill out form and fail', () => {
    page.load();
    page.enterInputByCss('ion-input[name="username"]', 'worker');
    page.enterInputByCss('ion-input[name="password"]', 'fail');
    page.clickButton('loginButton');
    expect(page.seeToast('color')).toBe('danger');
    expect(page.seeToast('message')).toBe('Incorrect username or password.');
  });

  it('should fill out form and succeed', () => {
    page.load();
    page.enterInputById('username', 'worker');
    page.enterInputById('password', 'secret');
    page.clickButton('loginButton');
    expect(page.wentToNextPage()).toBe(browser.baseUrl + 'app/tabs/marketplace');
  });
});



