import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ServiceComponentsPage, { ServiceDeleteDialog } from './service.page-object';
import ServiceUpdatePage from './service-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Service e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let serviceUpdatePage: ServiceUpdatePage;
  let serviceComponentsPage: ServiceComponentsPage;
  let serviceDeleteDialog: ServiceDeleteDialog;

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

  it('should load Services', async () => {
    await navBarPage.getEntityPage('service');
    serviceComponentsPage = new ServiceComponentsPage();
    expect(await serviceComponentsPage.getTitle().getText()).to.match(/Services/);
  });

  it('should load create Service page', async () => {
    await serviceComponentsPage.clickOnCreateButton();
    serviceUpdatePage = new ServiceUpdatePage();
    expect(await serviceUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.service.home.createOrEditLabel/);
    await serviceUpdatePage.cancel();
  });

  it('should create and save Services', async () => {
    async function createService() {
      await serviceComponentsPage.clickOnCreateButton();
      await serviceUpdatePage.setTitleInput('title');
      expect(await serviceUpdatePage.getTitleInput()).to.match(/title/);
      await serviceUpdatePage.setDescriptionInput('description');
      expect(await serviceUpdatePage.getDescriptionInput()).to.match(/description/);
      await serviceUpdatePage.typeSelectLastOption();
      await serviceUpdatePage.unitSelectLastOption();
      await serviceUpdatePage.statusSelectLastOption();
      await serviceUpdatePage.companySelectLastOption();
      await waitUntilDisplayed(serviceUpdatePage.getSaveButton());
      await serviceUpdatePage.save();
      await waitUntilHidden(serviceUpdatePage.getSaveButton());
      expect(await serviceUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createService();
    await serviceComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await serviceComponentsPage.countDeleteButtons();
    await createService();

    await serviceComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await serviceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Service', async () => {
    await serviceComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await serviceComponentsPage.countDeleteButtons();
    await serviceComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    serviceDeleteDialog = new ServiceDeleteDialog();
    expect(await serviceDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.service.delete.question/);
    await serviceDeleteDialog.clickOnConfirmButton();

    await serviceComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await serviceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
