import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ManouverRequestComponentsPage, { ManouverRequestDeleteDialog } from './manouver-request.page-object';
import ManouverRequestUpdatePage from './manouver-request-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('ManouverRequest e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let manouverRequestUpdatePage: ManouverRequestUpdatePage;
  let manouverRequestComponentsPage: ManouverRequestComponentsPage;
  let manouverRequestDeleteDialog: ManouverRequestDeleteDialog;
  const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);

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

  it('should load ManouverRequests', async () => {
    await navBarPage.getEntityPage('manouver-request');
    manouverRequestComponentsPage = new ManouverRequestComponentsPage();
    expect(await manouverRequestComponentsPage.getTitle().getText()).to.match(/Manouver Requests/);
  });

  it('should load create ManouverRequest page', async () => {
    await manouverRequestComponentsPage.clickOnCreateButton();
    manouverRequestUpdatePage = new ManouverRequestUpdatePage();
    expect(await manouverRequestUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /sistemaAmigoApp.manouverRequest.home.createOrEditLabel/
    );
    await manouverRequestUpdatePage.cancel();
  });

  it('should create and save ManouverRequests', async () => {
    async function createManouverRequest() {
      await manouverRequestComponentsPage.clickOnCreateButton();
      await manouverRequestUpdatePage.setTitleInput('title');
      expect(await manouverRequestUpdatePage.getTitleInput()).to.match(/title/);
      await manouverRequestUpdatePage.setDescriptionInput('description');
      expect(await manouverRequestUpdatePage.getDescriptionInput()).to.match(/description/);
      await manouverRequestUpdatePage.setDateInput('01-01-2001');
      expect(await manouverRequestUpdatePage.getDateInput()).to.eq('2001-01-01');
      await manouverRequestUpdatePage.transportTypeSelectLastOption();
      await manouverRequestUpdatePage.setQrCodeInput(absolutePath);
      await manouverRequestUpdatePage.originSelectLastOption();
      await manouverRequestUpdatePage.destinySelectLastOption();
      await manouverRequestUpdatePage.manouverSelectLastOption();
      await waitUntilDisplayed(manouverRequestUpdatePage.getSaveButton());
      await manouverRequestUpdatePage.save();
      await waitUntilHidden(manouverRequestUpdatePage.getSaveButton());
      expect(await manouverRequestUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createManouverRequest();
    await manouverRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await manouverRequestComponentsPage.countDeleteButtons();
    await createManouverRequest();

    await manouverRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await manouverRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last ManouverRequest', async () => {
    await manouverRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await manouverRequestComponentsPage.countDeleteButtons();
    await manouverRequestComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    manouverRequestDeleteDialog = new ManouverRequestDeleteDialog();
    expect(await manouverRequestDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /sistemaAmigoApp.manouverRequest.delete.question/
    );
    await manouverRequestDeleteDialog.clickOnConfirmButton();

    await manouverRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await manouverRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
