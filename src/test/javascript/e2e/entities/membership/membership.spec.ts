import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import MembershipComponentsPage, { MembershipDeleteDialog } from './membership.page-object';
import MembershipUpdatePage from './membership-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Membership e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let membershipUpdatePage: MembershipUpdatePage;
  let membershipComponentsPage: MembershipComponentsPage;
  let membershipDeleteDialog: MembershipDeleteDialog;
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

  it('should load Memberships', async () => {
    await navBarPage.getEntityPage('membership');
    membershipComponentsPage = new MembershipComponentsPage();
    expect(await membershipComponentsPage.getTitle().getText()).to.match(/Memberships/);
  });

  it('should load create Membership page', async () => {
    await membershipComponentsPage.clickOnCreateButton();
    membershipUpdatePage = new MembershipUpdatePage();
    expect(await membershipUpdatePage.getPageTitle().getAttribute('id')).to.match(/sistemaAmigoApp.membership.home.createOrEditLabel/);
    await membershipUpdatePage.cancel();
  });

  it('should create and save Memberships', async () => {
    async function createMembership() {
      await membershipComponentsPage.clickOnCreateButton();
      await membershipUpdatePage.setPhoneInput('phone');
      expect(await membershipUpdatePage.getPhoneInput()).to.match(/phone/);
      await membershipUpdatePage.roleSelectLastOption();
      await membershipUpdatePage.setProfilePictureInput(absolutePath);
      await membershipUpdatePage.setCreatedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await membershipUpdatePage.getCreatedInput()).to.contain('2001-01-01T02:30');
      await membershipUpdatePage.setExpiresInput('01-01-2001');
      expect(await membershipUpdatePage.getExpiresInput()).to.eq('2001-01-01');
      await membershipUpdatePage.accountLevelSelectLastOption();
      const selectedVerified = await membershipUpdatePage.getVerifiedInput().isSelected();
      if (selectedVerified) {
        await membershipUpdatePage.getVerifiedInput().click();
        expect(await membershipUpdatePage.getVerifiedInput().isSelected()).to.be.false;
      } else {
        await membershipUpdatePage.getVerifiedInput().click();
        expect(await membershipUpdatePage.getVerifiedInput().isSelected()).to.be.true;
      }
      await membershipUpdatePage.userSelectLastOption();
      await membershipUpdatePage.employerSelectLastOption();
      await waitUntilDisplayed(membershipUpdatePage.getSaveButton());
      await membershipUpdatePage.save();
      await waitUntilHidden(membershipUpdatePage.getSaveButton());
      expect(await membershipUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createMembership();
    await membershipComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await membershipComponentsPage.countDeleteButtons();
    await createMembership();

    await membershipComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await membershipComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Membership', async () => {
    await membershipComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await membershipComponentsPage.countDeleteButtons();
    await membershipComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    membershipDeleteDialog = new MembershipDeleteDialog();
    expect(await membershipDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/sistemaAmigoApp.membership.delete.question/);
    await membershipDeleteDialog.clickOnConfirmButton();

    await membershipComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await membershipComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
