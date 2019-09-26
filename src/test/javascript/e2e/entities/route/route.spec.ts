import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import RouteComponentsPage, { RouteDeleteDialog } from './route.page-object';
import RouteUpdatePage from './route-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Route e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let routeUpdatePage: RouteUpdatePage;
  let routeComponentsPage: RouteComponentsPage;
  let routeDeleteDialog: RouteDeleteDialog;

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

  it('should load Routes', async () => {
    await navBarPage.getEntityPage('route');
    routeComponentsPage = new RouteComponentsPage();
    expect(await routeComponentsPage.getTitle().getText()).to.match(/Routes/);
  });

  it('should load create Route page', async () => {
    await routeComponentsPage.clickOnCreateButton();
    routeUpdatePage = new RouteUpdatePage();
    expect(await routeUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.route.home.createOrEditLabel/);
    await routeUpdatePage.cancel();
  });

  it('should create and save Routes', async () => {
    async function createRoute() {
      await routeComponentsPage.clickOnCreateButton();
      await routeUpdatePage.setPriceInput('5');
      expect(await routeUpdatePage.getPriceInput()).to.eq('5');
      await routeUpdatePage.setNameInput('name');
      expect(await routeUpdatePage.getNameInput()).to.match(/name/);
      await routeUpdatePage.currencySelectLastOption();
      await waitUntilDisplayed(routeUpdatePage.getSaveButton());
      await routeUpdatePage.save();
      await waitUntilHidden(routeUpdatePage.getSaveButton());
      expect(await routeUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createRoute();
    await routeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await routeComponentsPage.countDeleteButtons();
    await createRoute();

    await routeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await routeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Route', async () => {
    await routeComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await routeComponentsPage.countDeleteButtons();
    await routeComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    routeDeleteDialog = new RouteDeleteDialog();
    expect(await routeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.route.delete.question/);
    await routeDeleteDialog.clickOnConfirmButton();

    await routeComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await routeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
