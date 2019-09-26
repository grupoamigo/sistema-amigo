import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ServiceRequestComponentsPage, { ServiceRequestDeleteDialog } from './service-request.page-object';
import ServiceRequestUpdatePage from './service-request-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('ServiceRequest e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let serviceRequestUpdatePage: ServiceRequestUpdatePage;
  let serviceRequestComponentsPage: ServiceRequestComponentsPage;
  let serviceRequestDeleteDialog: ServiceRequestDeleteDialog;

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

  it('should load ServiceRequests', async () => {
    await navBarPage.getEntityPage('service-request');
    serviceRequestComponentsPage = new ServiceRequestComponentsPage();
    expect(await serviceRequestComponentsPage.getTitle().getText()).to.match(/Service Requests/);
  });

  it('should load create ServiceRequest page', async () => {
    await serviceRequestComponentsPage.clickOnCreateButton();
    serviceRequestUpdatePage = new ServiceRequestUpdatePage();
    expect(await serviceRequestUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /sistemaAmigoApp.serviceRequest.home.createOrEditLabel/
    );
    await serviceRequestUpdatePage.cancel();
  });

  it('should create and save ServiceRequests', async () => {
    async function createServiceRequest() {
      await serviceRequestComponentsPage.clickOnCreateButton();
      await serviceRequestUpdatePage.setTitleInput('title');
      expect(await serviceRequestUpdatePage.getTitleInput()).to.match(/title/);
      await serviceRequestUpdatePage.setDescriptionInput('description');
      expect(await serviceRequestUpdatePage.getDescriptionInput()).to.match(/description/);
      await serviceRequestUpdatePage.setDateRequestedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await serviceRequestUpdatePage.getDateRequestedInput()).to.contain('2001-01-01T02:30');
      await serviceRequestUpdatePage.setDateBeginInput('01-01-2001');
      expect(await serviceRequestUpdatePage.getDateBeginInput()).to.eq('2001-01-01');
      await serviceRequestUpdatePage.setDateEndInput('01-01-2001');
      expect(await serviceRequestUpdatePage.getDateEndInput()).to.eq('2001-01-01');
      await serviceRequestUpdatePage.statusSelectLastOption();
      await serviceRequestUpdatePage.clientSelectLastOption();
      await serviceRequestUpdatePage.serviceQuoteSelectLastOption();
      await waitUntilDisplayed(serviceRequestUpdatePage.getSaveButton());
      await serviceRequestUpdatePage.save();
      await waitUntilHidden(serviceRequestUpdatePage.getSaveButton());
      expect(await serviceRequestUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createServiceRequest();
    await serviceRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await serviceRequestComponentsPage.countDeleteButtons();
    await createServiceRequest();

    await serviceRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await serviceRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last ServiceRequest', async () => {
    await serviceRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await serviceRequestComponentsPage.countDeleteButtons();
    await serviceRequestComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    serviceRequestDeleteDialog = new ServiceRequestDeleteDialog();
    expect(await serviceRequestDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.serviceRequest.delete.question/);
    await serviceRequestDeleteDialog.clickOnConfirmButton();

    await serviceRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await serviceRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
