import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CargoComponentsPage, { CargoDeleteDialog } from './cargo.page-object';
import CargoUpdatePage from './cargo-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Cargo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cargoUpdatePage: CargoUpdatePage;
  let cargoComponentsPage: CargoComponentsPage;
  let cargoDeleteDialog: CargoDeleteDialog;

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

  it('should load Cargos', async () => {
    await navBarPage.getEntityPage('cargo');
    cargoComponentsPage = new CargoComponentsPage();
    expect(await cargoComponentsPage.getTitle().getText()).to.match(/Cargos/);
  });

  it('should load create Cargo page', async () => {
    await cargoComponentsPage.clickOnCreateButton();
    cargoUpdatePage = new CargoUpdatePage();
    expect(await cargoUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.cargo.home.createOrEditLabel/);
    await cargoUpdatePage.cancel();
  });

  it('should create and save Cargos', async () => {
    async function createCargo() {
      await cargoComponentsPage.clickOnCreateButton();
      await cargoUpdatePage.typeSelectLastOption();
      await cargoUpdatePage.setUniqueIdInput('uniqueId');
      expect(await cargoUpdatePage.getUniqueIdInput()).to.match(/uniqueId/);
      await cargoUpdatePage.setDescriptionInput('description');
      expect(await cargoUpdatePage.getDescriptionInput()).to.match(/description/);
      await cargoUpdatePage.statusSelectLastOption();
      await cargoUpdatePage.warehouseSelectLastOption();
      await cargoUpdatePage.sealsSelectLastOption();
      await cargoUpdatePage.clientSelectLastOption();
      await cargoUpdatePage.warehousesSelectLastOption();
      await waitUntilDisplayed(cargoUpdatePage.getSaveButton());
      await cargoUpdatePage.save();
      await waitUntilHidden(cargoUpdatePage.getSaveButton());
      expect(await cargoUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createCargo();
    await cargoComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await cargoComponentsPage.countDeleteButtons();
    await createCargo();

    await cargoComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await cargoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Cargo', async () => {
    await cargoComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await cargoComponentsPage.countDeleteButtons();
    await cargoComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    cargoDeleteDialog = new CargoDeleteDialog();
    expect(await cargoDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.cargo.delete.question/);
    await cargoDeleteDialog.clickOnConfirmButton();

    await cargoComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await cargoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
