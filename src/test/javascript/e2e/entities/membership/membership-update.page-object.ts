import { element, by, ElementFinder } from 'protractor';

export default class MembershipUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.membership.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  phoneInput: ElementFinder = element(by.css('input#membership-phone'));
  roleSelect: ElementFinder = element(by.css('select#membership-role'));
  profilePictureInput: ElementFinder = element(by.css('input#file_profilePicture'));
  createdInput: ElementFinder = element(by.css('input#membership-created'));
  expiresInput: ElementFinder = element(by.css('input#membership-expires'));
  accountLevelSelect: ElementFinder = element(by.css('select#membership-accountLevel'));
  verifiedInput: ElementFinder = element(by.css('input#membership-verified'));
  userSelect: ElementFinder = element(by.css('select#membership-user'));
  employerSelect: ElementFinder = element(by.css('select#membership-employer'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setPhoneInput(phone) {
    await this.phoneInput.sendKeys(phone);
  }

  async getPhoneInput() {
    return this.phoneInput.getAttribute('value');
  }

  async setRoleSelect(role) {
    await this.roleSelect.sendKeys(role);
  }

  async getRoleSelect() {
    return this.roleSelect.element(by.css('option:checked')).getText();
  }

  async roleSelectLastOption() {
    await this.roleSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setProfilePictureInput(profilePicture) {
    await this.profilePictureInput.sendKeys(profilePicture);
  }

  async getProfilePictureInput() {
    return this.profilePictureInput.getAttribute('value');
  }

  async setCreatedInput(created) {
    await this.createdInput.sendKeys(created);
  }

  async getCreatedInput() {
    return this.createdInput.getAttribute('value');
  }

  async setExpiresInput(expires) {
    await this.expiresInput.sendKeys(expires);
  }

  async getExpiresInput() {
    return this.expiresInput.getAttribute('value');
  }

  async setAccountLevelSelect(accountLevel) {
    await this.accountLevelSelect.sendKeys(accountLevel);
  }

  async getAccountLevelSelect() {
    return this.accountLevelSelect.element(by.css('option:checked')).getText();
  }

  async accountLevelSelectLastOption() {
    await this.accountLevelSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  getVerifiedInput() {
    return this.verifiedInput;
  }
  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async employerSelectLastOption() {
    await this.employerSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async employerSelectOption(option) {
    await this.employerSelect.sendKeys(option);
  }

  getEmployerSelect() {
    return this.employerSelect;
  }

  async getEmployerSelectedOption() {
    return this.employerSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
