import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ServiceQuoteComponentsPage, { ServiceQuoteDeleteDialog } from './service-quote.page-object';
import ServiceQuoteUpdatePage from './service-quote-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('ServiceQuote e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let serviceQuoteUpdatePage: ServiceQuoteUpdatePage;
  let serviceQuoteComponentsPage: ServiceQuoteComponentsPage;
  let serviceQuoteDeleteDialog: ServiceQuoteDeleteDialog;
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

  it('should load ServiceQuotes', async () => {
    await navBarPage.getEntityPage('service-quote');
    serviceQuoteComponentsPage = new ServiceQuoteComponentsPage();
    expect(await serviceQuoteComponentsPage.getTitle().getText()).to.match(/Service Quotes/);
  });

  it('should load create ServiceQuote page', async () => {
    await serviceQuoteComponentsPage.clickOnCreateButton();
    serviceQuoteUpdatePage = new ServiceQuoteUpdatePage();
    expect(await serviceQuoteUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.serviceQuote.home.createOrEditLabel/);
    await serviceQuoteUpdatePage.cancel();
  });

  it('should create and save ServiceQuotes', async () => {
    async function createServiceQuote() {
      await serviceQuoteComponentsPage.clickOnCreateButton();
      await serviceQuoteUpdatePage.setTitleInput('title');
      expect(await serviceQuoteUpdatePage.getTitleInput()).to.match(/title/);
      await serviceQuoteUpdatePage.setDescriptionInput('description');
      expect(await serviceQuoteUpdatePage.getDescriptionInput()).to.match(/description/);
      await serviceQuoteUpdatePage.setQuantityInput('5');
      expect(await serviceQuoteUpdatePage.getQuantityInput()).to.eq('5');
      await serviceQuoteUpdatePage.setPriceInput('5');
      expect(await serviceQuoteUpdatePage.getPriceInput()).to.eq('5');
      await serviceQuoteUpdatePage.unitSelectLastOption();
      await serviceQuoteUpdatePage.setExpeditionDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await serviceQuoteUpdatePage.getExpeditionDateInput()).to.contain('2001-01-01T02:30');
      await serviceQuoteUpdatePage.setExpirationDateInput('01-01-2001');
      expect(await serviceQuoteUpdatePage.getExpirationDateInput()).to.eq('2001-01-01');
      await serviceQuoteUpdatePage.statusSelectLastOption();
      await serviceQuoteUpdatePage.currencySelectLastOption();
      await serviceQuoteUpdatePage.setApprovedByInput('approvedBy');
      expect(await serviceQuoteUpdatePage.getApprovedByInput()).to.match(/approvedBy/);
      await serviceQuoteUpdatePage.setQrCodeInput(absolutePath);
      await serviceQuoteUpdatePage.contractSelectLastOption();
      await waitUntilDisplayed(serviceQuoteUpdatePage.getSaveButton());
      await serviceQuoteUpdatePage.save();
      await waitUntilHidden(serviceQuoteUpdatePage.getSaveButton());
      expect(await serviceQuoteUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createServiceQuote();
    await serviceQuoteComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await serviceQuoteComponentsPage.countDeleteButtons();
    await createServiceQuote();

    await serviceQuoteComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await serviceQuoteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last ServiceQuote', async () => {
    await serviceQuoteComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await serviceQuoteComponentsPage.countDeleteButtons();
    await serviceQuoteComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    serviceQuoteDeleteDialog = new ServiceQuoteDeleteDialog();
    expect(await serviceQuoteDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.serviceQuote.delete.question/);
    await serviceQuoteDeleteDialog.clickOnConfirmButton();

    await serviceQuoteComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await serviceQuoteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
