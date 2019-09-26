import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import DamageComponentsPage, { DamageDeleteDialog } from './damage.page-object';
import DamageUpdatePage from './damage-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Damage e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let damageUpdatePage: DamageUpdatePage;
  let damageComponentsPage: DamageComponentsPage;
  let damageDeleteDialog: DamageDeleteDialog;

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

  it('should load Damages', async () => {
    await navBarPage.getEntityPage('damage');
    damageComponentsPage = new DamageComponentsPage();
    expect(await damageComponentsPage.getTitle().getText()).to.match(/Damages/);
  });

  it('should load create Damage page', async () => {
    await damageComponentsPage.clickOnCreateButton();
    damageUpdatePage = new DamageUpdatePage();
    expect(await damageUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.damage.home.createOrEditLabel/);
    await damageUpdatePage.cancel();
  });

  it('should create and save Damages', async () => {
    async function createDamage() {
      await damageComponentsPage.clickOnCreateButton();
      await damageUpdatePage.setReportDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await damageUpdatePage.getReportDateInput()).to.contain('2001-01-01T02:30');
      await damageUpdatePage.setDescriptionInput('description');
      expect(await damageUpdatePage.getDescriptionInput()).to.match(/description/);
      await waitUntilDisplayed(damageUpdatePage.getSaveButton());
      await damageUpdatePage.save();
      await waitUntilHidden(damageUpdatePage.getSaveButton());
      expect(await damageUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createDamage();
    await damageComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await damageComponentsPage.countDeleteButtons();
    await createDamage();

    await damageComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await damageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Damage', async () => {
    await damageComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await damageComponentsPage.countDeleteButtons();
    await damageComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    damageDeleteDialog = new DamageDeleteDialog();
    expect(await damageDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.damage.delete.question/);
    await damageDeleteDialog.clickOnConfirmButton();

    await damageComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await damageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
