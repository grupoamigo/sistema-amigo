import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TransportComponentsPage, { TransportDeleteDialog } from './transport.page-object';
import TransportUpdatePage from './transport-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Transport e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transportUpdatePage: TransportUpdatePage;
  let transportComponentsPage: TransportComponentsPage;
  let transportDeleteDialog: TransportDeleteDialog;

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

  it('should load Transports', async () => {
    await navBarPage.getEntityPage('transport');
    transportComponentsPage = new TransportComponentsPage();
    expect(await transportComponentsPage.getTitle().getText()).to.match(/Transports/);
  });

  it('should load create Transport page', async () => {
    await transportComponentsPage.clickOnCreateButton();
    transportUpdatePage = new TransportUpdatePage();
    expect(await transportUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.transport.home.createOrEditLabel/);
    await transportUpdatePage.cancel();
  });

  it('should create and save Transports', async () => {
    async function createTransport() {
      await transportComponentsPage.clickOnCreateButton();
      await transportUpdatePage.setPlateIdInput('plateId');
      expect(await transportUpdatePage.getPlateIdInput()).to.match(/plateId/);
      await transportUpdatePage.typeSelectLastOption();
      await transportUpdatePage.ownerSelectLastOption();
      await waitUntilDisplayed(transportUpdatePage.getSaveButton());
      await transportUpdatePage.save();
      await waitUntilHidden(transportUpdatePage.getSaveButton());
      expect(await transportUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createTransport();
    await transportComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await transportComponentsPage.countDeleteButtons();
    await createTransport();

    await transportComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await transportComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Transport', async () => {
    await transportComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await transportComponentsPage.countDeleteButtons();
    await transportComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    transportDeleteDialog = new TransportDeleteDialog();
    expect(await transportDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.transport.delete.question/);
    await transportDeleteDialog.clickOnConfirmButton();

    await transportComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await transportComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
