import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ContractComponentsPage, { ContractDeleteDialog } from './contract.page-object';
import ContractUpdatePage from './contract-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Contract e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let contractUpdatePage: ContractUpdatePage;
  let contractComponentsPage: ContractComponentsPage;
  let contractDeleteDialog: ContractDeleteDialog;
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

  it('should load Contracts', async () => {
    await navBarPage.getEntityPage('contract');
    contractComponentsPage = new ContractComponentsPage();
    expect(await contractComponentsPage.getTitle().getText()).to.match(/Contracts/);
  });

  it('should load create Contract page', async () => {
    await contractComponentsPage.clickOnCreateButton();
    contractUpdatePage = new ContractUpdatePage();
    expect(await contractUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.contract.home.createOrEditLabel/);
    await contractUpdatePage.cancel();
  });

  it('should create and save Contracts', async () => {
    async function createContract() {
      await contractComponentsPage.clickOnCreateButton();
      await contractUpdatePage.typeSelectLastOption();
      await contractUpdatePage.setTitleInput('title');
      expect(await contractUpdatePage.getTitleInput()).to.match(/title/);
      await contractUpdatePage.setLegalProseInput('legalProse');
      expect(await contractUpdatePage.getLegalProseInput()).to.match(/legalProse/);
      await contractUpdatePage.setSignatureInput(absolutePath);
      await contractUpdatePage.setContractFileInput(absolutePath);
      await contractUpdatePage.setQrCodeInput(absolutePath);
      await contractUpdatePage.setDigitalFingerprintInput('digitalFingerprint');
      expect(await contractUpdatePage.getDigitalFingerprintInput()).to.match(/digitalFingerprint/);
      await contractUpdatePage.setDateSignedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await contractUpdatePage.getDateSignedInput()).to.contain('2001-01-01T02:30');
      await contractUpdatePage.setExpirationDateInput('01-01-2001');
      expect(await contractUpdatePage.getExpirationDateInput()).to.eq('2001-01-01');
      await contractUpdatePage.statusSelectLastOption();
      await contractUpdatePage.companiesSelectLastOption();
      await waitUntilDisplayed(contractUpdatePage.getSaveButton());
      await contractUpdatePage.save();
      await waitUntilHidden(contractUpdatePage.getSaveButton());
      expect(await contractUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createContract();
    await contractComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await contractComponentsPage.countDeleteButtons();
    await createContract();

    await contractComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await contractComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Contract', async () => {
    await contractComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await contractComponentsPage.countDeleteButtons();
    await contractComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    contractDeleteDialog = new ContractDeleteDialog();
    expect(await contractDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.contract.delete.question/);
    await contractDeleteDialog.clickOnConfirmButton();

    await contractComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await contractComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
