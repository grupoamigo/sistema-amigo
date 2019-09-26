import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ClientComponentsPage, { ClientDeleteDialog } from './client.page-object';
import ClientUpdatePage from './client-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Client e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let clientUpdatePage: ClientUpdatePage;
  let clientComponentsPage: ClientComponentsPage;
  let clientDeleteDialog: ClientDeleteDialog;

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

  it('should load Clients', async () => {
    await navBarPage.getEntityPage('client');
    clientComponentsPage = new ClientComponentsPage();
    expect(await clientComponentsPage.getTitle().getText()).to.match(/Clients/);
  });

  it('should load create Client page', async () => {
    await clientComponentsPage.clickOnCreateButton();
    clientUpdatePage = new ClientUpdatePage();
    expect(await clientUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.client.home.createOrEditLabel/);
    await clientUpdatePage.cancel();
  });

  it('should create and save Clients', async () => {
    async function createClient() {
      await clientComponentsPage.clickOnCreateButton();
      await clientUpdatePage.setMemberSinceInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await clientUpdatePage.getMemberSinceInput()).to.contain('2001-01-01T02:30');
      await clientUpdatePage.statusSelectLastOption();
      await clientUpdatePage.setInternalNotesInput('internalNotes');
      expect(await clientUpdatePage.getInternalNotesInput()).to.match(/internalNotes/);
      await clientUpdatePage.setUniqueIdInput('uniqueId');
      expect(await clientUpdatePage.getUniqueIdInput()).to.match(/uniqueId/);
      await waitUntilDisplayed(clientUpdatePage.getSaveButton());
      await clientUpdatePage.save();
      await waitUntilHidden(clientUpdatePage.getSaveButton());
      expect(await clientUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createClient();
    await clientComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await clientComponentsPage.countDeleteButtons();
    await createClient();

    await clientComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await clientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Client', async () => {
    await clientComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await clientComponentsPage.countDeleteButtons();
    await clientComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    clientDeleteDialog = new ClientDeleteDialog();
    expect(await clientDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.client.delete.question/);
    await clientDeleteDialog.clickOnConfirmButton();

    await clientComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await clientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
