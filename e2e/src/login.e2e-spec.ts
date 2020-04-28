import {LoginPage} from './login.po';
import {browser} from 'protractor';

describe('login page', () => {
  const page = new LoginPage();

  beforeEach(() => {
    page.load();
  });

  it('should validate the form', () => {
    page.load();
    page.clickButton();
    expect(page.fieldIsRequired('usernameRequired')).toBe('Username is required');
    expect(page.fieldIsRequired('passwordRequired')).toBe('Password is required');
  });

  it('should fill out form and fail', () => {
    page.load();
    page.enterInput('username', 'worker');
    page.enterInput('password', 'fail');
    page.clickButton();
    expect(page.seeToast('color')).toBe('danger');
    expect(page.seeToast('message')).toBe('Incorrect username or password.');
  });

  it('should fill out form and succeed', () => {
    page.load();
    page.enterInput('username', 'worker');
    page.enterInput('password', 'secret');
    page.clickButton();
    expect(page.wentToNextPage()).toBe(browser.baseUrl + 'app/tabs/marketplace');
  });
});
