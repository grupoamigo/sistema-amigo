import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WarehouseComponentsPage, { WarehouseDeleteDialog } from './warehouse.page-object';
import WarehouseUpdatePage from './warehouse-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Warehouse e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let warehouseUpdatePage: WarehouseUpdatePage;
  let warehouseComponentsPage: WarehouseComponentsPage;
  let warehouseDeleteDialog: WarehouseDeleteDialog;

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

  it('should load Warehouses', async () => {
    await navBarPage.getEntityPage('warehouse');
    warehouseComponentsPage = new WarehouseComponentsPage();
    expect(await warehouseComponentsPage.getTitle().getText()).to.match(/Warehouses/);
  });

  it('should load create Warehouse page', async () => {
    await warehouseComponentsPage.clickOnCreateButton();
    warehouseUpdatePage = new WarehouseUpdatePage();
    expect(await warehouseUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.warehouse.home.createOrEditLabel/);
    await warehouseUpdatePage.cancel();
  });

  it('should create and save Warehouses', async () => {
    async function createWarehouse() {
      await warehouseComponentsPage.clickOnCreateButton();
      await warehouseUpdatePage.setNameInput('name');
      expect(await warehouseUpdatePage.getNameInput()).to.match(/name/);
      await warehouseUpdatePage.divisionSelectLastOption();
      await warehouseUpdatePage.ownerSelectLastOption();
      await waitUntilDisplayed(warehouseUpdatePage.getSaveButton());
      await warehouseUpdatePage.save();
      await waitUntilHidden(warehouseUpdatePage.getSaveButton());
      expect(await warehouseUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createWarehouse();
    await warehouseComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await warehouseComponentsPage.countDeleteButtons();
    await createWarehouse();

    await warehouseComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await warehouseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Warehouse', async () => {
    await warehouseComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await warehouseComponentsPage.countDeleteButtons();
    await warehouseComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    warehouseDeleteDialog = new WarehouseDeleteDialog();
    expect(await warehouseDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.warehouse.delete.question/);
    await warehouseDeleteDialog.clickOnConfirmButton();

    await warehouseComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await warehouseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
