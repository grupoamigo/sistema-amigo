import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ContactCardComponentsPage, { ContactCardDeleteDialog } from './contact-card.page-object';
import ContactCardUpdatePage from './contact-card-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('ContactCard e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let contactCardUpdatePage: ContactCardUpdatePage;
  let contactCardComponentsPage: ContactCardComponentsPage;
  let contactCardDeleteDialog: ContactCardDeleteDialog;

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

  it('should load ContactCards', async () => {
    await navBarPage.getEntityPage('contact-card');
    contactCardComponentsPage = new ContactCardComponentsPage();
    expect(await contactCardComponentsPage.getTitle().getText()).to.match(/Contact Cards/);
  });

  it('should load create ContactCard page', async () => {
    await contactCardComponentsPage.clickOnCreateButton();
    contactCardUpdatePage = new ContactCardUpdatePage();
    expect(await contactCardUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.contactCard.home.createOrEditLabel/);
    await contactCardUpdatePage.cancel();
  });

  it('should create and save ContactCards', async () => {
    async function createContactCard() {
      await contactCardComponentsPage.clickOnCreateButton();
      await contactCardUpdatePage.typeSelectLastOption();
      await contactCardUpdatePage.setValueInput('value');
      expect(await contactCardUpdatePage.getValueInput()).to.match(/value/);
      await waitUntilDisplayed(contactCardUpdatePage.getSaveButton());
      await contactCardUpdatePage.save();
      await waitUntilHidden(contactCardUpdatePage.getSaveButton());
      expect(await contactCardUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createContactCard();
    await contactCardComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await contactCardComponentsPage.countDeleteButtons();
    await createContactCard();

    await contactCardComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await contactCardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last ContactCard', async () => {
    await contactCardComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await contactCardComponentsPage.countDeleteButtons();
    await contactCardComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    contactCardDeleteDialog = new ContactCardDeleteDialog();
    expect(await contactCardDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.contactCard.delete.question/);
    await contactCardDeleteDialog.clickOnConfirmButton();

    await contactCardComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await contactCardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
