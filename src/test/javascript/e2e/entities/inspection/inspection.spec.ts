import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import InspectionComponentsPage, { InspectionDeleteDialog } from './inspection.page-object';
import InspectionUpdatePage from './inspection-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Inspection e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let inspectionUpdatePage: InspectionUpdatePage;
  let inspectionComponentsPage: InspectionComponentsPage;
  let inspectionDeleteDialog: InspectionDeleteDialog;
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

  it('should load Inspections', async () => {
    await navBarPage.getEntityPage('inspection');
    inspectionComponentsPage = new InspectionComponentsPage();
    expect(await inspectionComponentsPage.getTitle().getText()).to.match(/Inspections/);
  });

  it('should load create Inspection page', async () => {
    await inspectionComponentsPage.clickOnCreateButton();
    inspectionUpdatePage = new InspectionUpdatePage();
    expect(await inspectionUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.inspection.home.createOrEditLabel/);
    await inspectionUpdatePage.cancel();
  });

  it('should create and save Inspections', async () => {
    async function createInspection() {
      await inspectionComponentsPage.clickOnCreateButton();
      await inspectionUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await inspectionUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
      await inspectionUpdatePage.setSignatureInput(absolutePath);
      await inspectionUpdatePage.locationSelectLastOption();
      await waitUntilDisplayed(inspectionUpdatePage.getSaveButton());
      await inspectionUpdatePage.save();
      await waitUntilHidden(inspectionUpdatePage.getSaveButton());
      expect(await inspectionUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createInspection();
    await inspectionComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await inspectionComponentsPage.countDeleteButtons();
    await createInspection();

    await inspectionComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await inspectionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Inspection', async () => {
    await inspectionComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await inspectionComponentsPage.countDeleteButtons();
    await inspectionComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    inspectionDeleteDialog = new InspectionDeleteDialog();
    expect(await inspectionDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.inspection.delete.question/);
    await inspectionDeleteDialog.clickOnConfirmButton();

    await inspectionComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await inspectionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
