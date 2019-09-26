import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CountryCodeComponentsPage, { CountryCodeDeleteDialog } from './country-code.page-object';
import CountryCodeUpdatePage from './country-code-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('CountryCode e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let countryCodeUpdatePage: CountryCodeUpdatePage;
  let countryCodeComponentsPage: CountryCodeComponentsPage;
  let countryCodeDeleteDialog: CountryCodeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load CountryCodes', async () => {
    await navBarPage.getEntityPage('country-code');
    countryCodeComponentsPage = new CountryCodeComponentsPage();
    expect(await countryCodeComponentsPage.getTitle().getText()).to.match(/Country Codes/);
  });

  it('should load create CountryCode page', async () => {
    await countryCodeComponentsPage.clickOnCreateButton();
    countryCodeUpdatePage = new CountryCodeUpdatePage();
    expect(await countryCodeUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.countryCode.home.createOrEditLabel/);
    await countryCodeUpdatePage.cancel();
  });

  it('should create and save CountryCodes', async () => {
    async function createCountryCode() {
      await countryCodeComponentsPage.clickOnCreateButton();
      await countryCodeUpdatePage.setCodeInput('code');
      expect(await countryCodeUpdatePage.getCodeInput()).to.match(/code/);
      await countryCodeUpdatePage.setNameInput('name');
      expect(await countryCodeUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(countryCodeUpdatePage.getSaveButton());
      await countryCodeUpdatePage.save();
      await waitUntilHidden(countryCodeUpdatePage.getSaveButton());
      expect(await countryCodeUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createCountryCode();
    await countryCodeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await countryCodeComponentsPage.countDeleteButtons();
    await createCountryCode();

    await countryCodeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await countryCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last CountryCode', async () => {
    await countryCodeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await countryCodeComponentsPage.countDeleteButtons();
    await countryCodeComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    countryCodeDeleteDialog = new CountryCodeDeleteDialog();
    expect(await countryCodeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.countryCode.delete.question/);
    await countryCodeDeleteDialog.clickOnConfirmButton();

    await countryCodeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await countryCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
