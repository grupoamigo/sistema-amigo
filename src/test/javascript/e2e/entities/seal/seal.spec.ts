import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SealComponentsPage, { SealDeleteDialog } from './seal.page-object';
import SealUpdatePage from './seal-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Seal e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let sealUpdatePage: SealUpdatePage;
  let sealComponentsPage: SealComponentsPage;
  let sealDeleteDialog: SealDeleteDialog;

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

  it('should load Seals', async () => {
    await navBarPage.getEntityPage('seal');
    sealComponentsPage = new SealComponentsPage();
    expect(await sealComponentsPage.getTitle().getText()).to.match(/Seals/);
  });

  it('should load create Seal page', async () => {
    await sealComponentsPage.clickOnCreateButton();
    sealUpdatePage = new SealUpdatePage();
    expect(await sealUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.seal.home.createOrEditLabel/);
    await sealUpdatePage.cancel();
  });

  it('should create and save Seals', async () => {
    async function createSeal() {
      await sealComponentsPage.clickOnCreateButton();
      await sealUpdatePage.setIssuerInput('issuer');
      expect(await sealUpdatePage.getIssuerInput()).to.match(/issuer/);
      await sealUpdatePage.setUniqueIdInput('uniqueId');
      expect(await sealUpdatePage.getUniqueIdInput()).to.match(/uniqueId/);
      await waitUntilDisplayed(sealUpdatePage.getSaveButton());
      await sealUpdatePage.save();
      await waitUntilHidden(sealUpdatePage.getSaveButton());
      expect(await sealUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createSeal();
    await sealComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await sealComponentsPage.countDeleteButtons();
    await createSeal();

    await sealComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await sealComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Seal', async () => {
    await sealComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await sealComponentsPage.countDeleteButtons();
    await sealComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    sealDeleteDialog = new SealDeleteDialog();
    expect(await sealDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.seal.delete.question/);
    await sealDeleteDialog.clickOnConfirmButton();

    await sealComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await sealComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
