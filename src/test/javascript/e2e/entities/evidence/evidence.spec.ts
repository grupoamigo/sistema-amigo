import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import EvidenceComponentsPage, { EvidenceDeleteDialog } from './evidence.page-object';
import EvidenceUpdatePage from './evidence-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Evidence e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let evidenceUpdatePage: EvidenceUpdatePage;
  let evidenceComponentsPage: EvidenceComponentsPage;
  let evidenceDeleteDialog: EvidenceDeleteDialog;
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

  it('should load Evidences', async () => {
    await navBarPage.getEntityPage('evidence');
    evidenceComponentsPage = new EvidenceComponentsPage();
    expect(await evidenceComponentsPage.getTitle().getText()).to.match(/Evidences/);
  });

  it('should load create Evidence page', async () => {
    await evidenceComponentsPage.clickOnCreateButton();
    evidenceUpdatePage = new EvidenceUpdatePage();
    expect(await evidenceUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.evidence.home.createOrEditLabel/);
    await evidenceUpdatePage.cancel();
  });

  it('should create and save Evidences', async () => {
    async function createEvidence() {
      await evidenceComponentsPage.clickOnCreateButton();
      await evidenceUpdatePage.setNameInput('name');
      expect(await evidenceUpdatePage.getNameInput()).to.match(/name/);
      await evidenceUpdatePage.setFileInput(absolutePath);
      await waitUntilDisplayed(evidenceUpdatePage.getSaveButton());
      await evidenceUpdatePage.save();
      await waitUntilHidden(evidenceUpdatePage.getSaveButton());
      expect(await evidenceUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createEvidence();
    await evidenceComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await evidenceComponentsPage.countDeleteButtons();
    await createEvidence();

    await evidenceComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await evidenceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Evidence', async () => {
    await evidenceComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await evidenceComponentsPage.countDeleteButtons();
    await evidenceComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    evidenceDeleteDialog = new EvidenceDeleteDialog();
    expect(await evidenceDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.evidence.delete.question/);
    await evidenceDeleteDialog.clickOnConfirmButton();

    await evidenceComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await evidenceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
