import { element, by, ElementFinder } from 'protractor';

export default class DriverUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.driver.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  officialIdInput: ElementFinder = element(by.css('input#file_officialId'));
  firstNameInput: ElementFinder = element(by.css('input#driver-firstName'));
  lastNameInput: ElementFinder = element(by.css('input#driver-lastName'));
  pictureInput: ElementFinder = element(by.css('input#file_picture'));
  userSelect: ElementFinder = element(by.css('select#driver-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setOfficialIdInput(officialId) {
    await this.officialIdInput.sendKeys(officialId);
  }

  async getOfficialIdInput() {
    return this.officialIdInput.getAttribute('value');
  }

  async setFirstNameInput(firstName) {
    await this.firstNameInput.sendKeys(firstName);
  }

  async getFirstNameInput() {
    return this.firstNameInput.getAttribute('value');
  }

  async setLastNameInput(lastName) {
    await this.lastNameInput.sendKeys(lastName);
  }

  async getLastNameInput() {
    return this.lastNameInput.getAttribute('value');
  }

  async setPictureInput(picture) {
    await this.pictureInput.sendKeys(picture);
  }

  async getPictureInput() {
    return this.pictureInput.getAttribute('value');
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
