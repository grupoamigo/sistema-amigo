import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ManouverComponentsPage, { ManouverDeleteDialog } from './manouver.page-object';
import ManouverUpdatePage from './manouver-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Manouver e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let manouverUpdatePage: ManouverUpdatePage;
  let manouverComponentsPage: ManouverComponentsPage;
  let manouverDeleteDialog: ManouverDeleteDialog;

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

  it('should load Manouvers', async () => {
    await navBarPage.getEntityPage('manouver');
    manouverComponentsPage = new ManouverComponentsPage();
    expect(await manouverComponentsPage.getTitle().getText()).to.match(/Manouvers/);
  });

  it('should load create Manouver page', async () => {
    await manouverComponentsPage.clickOnCreateButton();
    manouverUpdatePage = new ManouverUpdatePage();
    expect(await manouverUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.manouver.home.createOrEditLabel/);
    await manouverUpdatePage.cancel();
  });

  it('should create and save Manouvers', async () => {
    async function createManouver() {
      await manouverComponentsPage.clickOnCreateButton();
      await manouverUpdatePage.setTitleInput('title');
      expect(await manouverUpdatePage.getTitleInput()).to.match(/title/);
      await manouverUpdatePage.setDescriptionInput('description');
      expect(await manouverUpdatePage.getDescriptionInput()).to.match(/description/);
      await manouverUpdatePage.unitSelectLastOption();
      await manouverUpdatePage.divisionSelectLastOption();
      await manouverUpdatePage.setPriceInput('5');
      expect(await manouverUpdatePage.getPriceInput()).to.eq('5');
      await manouverUpdatePage.currencySelectLastOption();
      await manouverUpdatePage.providerSelectLastOption();
      await waitUntilDisplayed(manouverUpdatePage.getSaveButton());
      await manouverUpdatePage.save();
      await waitUntilHidden(manouverUpdatePage.getSaveButton());
      expect(await manouverUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createManouver();
    await manouverComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await manouverComponentsPage.countDeleteButtons();
    await createManouver();

    await manouverComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await manouverComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Manouver', async () => {
    await manouverComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await manouverComponentsPage.countDeleteButtons();
    await manouverComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    manouverDeleteDialog = new ManouverDeleteDialog();
    expect(await manouverDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.manouver.delete.question/);
    await manouverDeleteDialog.clickOnConfirmButton();

    await manouverComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await manouverComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
