import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ExtraFieldComponentsPage, { ExtraFieldDeleteDialog } from './extra-field.page-object';
import ExtraFieldUpdatePage from './extra-field-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('ExtraField e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let extraFieldUpdatePage: ExtraFieldUpdatePage;
  let extraFieldComponentsPage: ExtraFieldComponentsPage;
  let extraFieldDeleteDialog: ExtraFieldDeleteDialog;

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

  it('should load ExtraFields', async () => {
    await navBarPage.getEntityPage('extra-field');
    extraFieldComponentsPage = new ExtraFieldComponentsPage();
    expect(await extraFieldComponentsPage.getTitle().getText()).to.match(/Extra Fields/);
  });

  it('should load create ExtraField page', async () => {
    await extraFieldComponentsPage.clickOnCreateButton();
    extraFieldUpdatePage = new ExtraFieldUpdatePage();
    expect(await extraFieldUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.extraField.home.createOrEditLabel/);
    await extraFieldUpdatePage.cancel();
  });

  it('should create and save ExtraFields', async () => {
    async function createExtraField() {
      await extraFieldComponentsPage.clickOnCreateButton();
      await extraFieldUpdatePage.setNameInput('name');
      expect(await extraFieldUpdatePage.getNameInput()).to.match(/name/);
      await extraFieldUpdatePage.setValueInput('value');
      expect(await extraFieldUpdatePage.getValueInput()).to.match(/value/);
      await waitUntilDisplayed(extraFieldUpdatePage.getSaveButton());
      await extraFieldUpdatePage.save();
      await waitUntilHidden(extraFieldUpdatePage.getSaveButton());
      expect(await extraFieldUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createExtraField();
    await extraFieldComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await extraFieldComponentsPage.countDeleteButtons();
    await createExtraField();

    await extraFieldComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await extraFieldComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last ExtraField', async () => {
    await extraFieldComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await extraFieldComponentsPage.countDeleteButtons();
    await extraFieldComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    extraFieldDeleteDialog = new ExtraFieldDeleteDialog();
    expect(await extraFieldDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.extraField.delete.question/);
    await extraFieldDeleteDialog.clickOnConfirmButton();

    await extraFieldComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await extraFieldComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
