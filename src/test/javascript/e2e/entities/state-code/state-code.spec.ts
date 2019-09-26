import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import StateCodeComponentsPage, { StateCodeDeleteDialog } from './state-code.page-object';
import StateCodeUpdatePage from './state-code-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('StateCode e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let stateCodeUpdatePage: StateCodeUpdatePage;
  let stateCodeComponentsPage: StateCodeComponentsPage;
  let stateCodeDeleteDialog: StateCodeDeleteDialog;

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

  it('should load StateCodes', async () => {
    await navBarPage.getEntityPage('state-code');
    stateCodeComponentsPage = new StateCodeComponentsPage();
    expect(await stateCodeComponentsPage.getTitle().getText()).to.match(/State Codes/);
  });

  it('should load create StateCode page', async () => {
    await stateCodeComponentsPage.clickOnCreateButton();
    stateCodeUpdatePage = new StateCodeUpdatePage();
    expect(await stateCodeUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.stateCode.home.createOrEditLabel/);
    await stateCodeUpdatePage.cancel();
  });

  it('should create and save StateCodes', async () => {
    async function createStateCode() {
      await stateCodeComponentsPage.clickOnCreateButton();
      await stateCodeUpdatePage.setCodeInput('code');
      expect(await stateCodeUpdatePage.getCodeInput()).to.match(/code/);
      await stateCodeUpdatePage.setNameInput('name');
      expect(await stateCodeUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(stateCodeUpdatePage.getSaveButton());
      await stateCodeUpdatePage.save();
      await waitUntilHidden(stateCodeUpdatePage.getSaveButton());
      expect(await stateCodeUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createStateCode();
    await stateCodeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await stateCodeComponentsPage.countDeleteButtons();
    await createStateCode();

    await stateCodeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await stateCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last StateCode', async () => {
    await stateCodeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await stateCodeComponentsPage.countDeleteButtons();
    await stateCodeComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    stateCodeDeleteDialog = new StateCodeDeleteDialog();
    expect(await stateCodeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.stateCode.delete.question/);
    await stateCodeDeleteDialog.clickOnConfirmButton();

    await stateCodeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await stateCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
