import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import LocationComponentsPage, { LocationDeleteDialog } from './location.page-object';
import LocationUpdatePage from './location-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Location e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let locationUpdatePage: LocationUpdatePage;
  let locationComponentsPage: LocationComponentsPage;
  let locationDeleteDialog: LocationDeleteDialog;

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

  it('should load Locations', async () => {
    await navBarPage.getEntityPage('location');
    locationComponentsPage = new LocationComponentsPage();
    expect(await locationComponentsPage.getTitle().getText()).to.match(/Locations/);
  });

  it('should load create Location page', async () => {
    await locationComponentsPage.clickOnCreateButton();
    locationUpdatePage = new LocationUpdatePage();
    expect(await locationUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.location.home.createOrEditLabel/);
    await locationUpdatePage.cancel();
  });

  it('should create and save Locations', async () => {
    async function createLocation() {
      await locationComponentsPage.clickOnCreateButton();
      await locationUpdatePage.setAddressInput('address');
      expect(await locationUpdatePage.getAddressInput()).to.match(/address/);
      await locationUpdatePage.setLatInput('lat');
      expect(await locationUpdatePage.getLatInput()).to.match(/lat/);
      await locationUpdatePage.setLngInput('lng');
      expect(await locationUpdatePage.getLngInput()).to.match(/lng/);
      await locationUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await locationUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
      await waitUntilDisplayed(locationUpdatePage.getSaveButton());
      await locationUpdatePage.save();
      await waitUntilHidden(locationUpdatePage.getSaveButton());
      expect(await locationUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createLocation();
    await locationComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await locationComponentsPage.countDeleteButtons();
    await createLocation();

    await locationComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Location', async () => {
    await locationComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await locationComponentsPage.countDeleteButtons();
    await locationComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    locationDeleteDialog = new LocationDeleteDialog();
    expect(await locationDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.location.delete.question/);
    await locationDeleteDialog.clickOnConfirmButton();

    await locationComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
