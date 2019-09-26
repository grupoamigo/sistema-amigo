import { element, by, ElementFinder } from 'protractor';

export default class ManouverRequestUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.manouverRequest.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#manouver-request-title'));
  descriptionInput: ElementFinder = element(by.css('input#manouver-request-description'));
  dateInput: ElementFinder = element(by.css('input#manouver-request-date'));
  transportTypeSelect: ElementFinder = element(by.css('select#manouver-request-transportType'));
  qrCodeInput: ElementFinder = element(by.css('input#file_qrCode'));
  originSelect: ElementFinder = element(by.css('select#manouver-request-origin'));
  destinySelect: ElementFinder = element(by.css('select#manouver-request-destiny'));
  manouverSelect: ElementFinder = element(by.css('select#manouver-request-manouver'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return this.dateInput.getAttribute('value');
  }

  async setTransportTypeSelect(transportType) {
    await this.transportTypeSelect.sendKeys(transportType);
  }

  async getTransportTypeSelect() {
    return this.transportTypeSelect.element(by.css('option:checked')).getText();
  }

  async transportTypeSelectLastOption() {
    await this.transportTypeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setQrCodeInput(qrCode) {
    await this.qrCodeInput.sendKeys(qrCode);
  }

  async getQrCodeInput() {
    return this.qrCodeInput.getAttribute('value');
  }

  async originSelectLastOption() {
    await this.originSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async originSelectOption(option) {
    await this.originSelect.sendKeys(option);
  }

  getOriginSelect() {
    return this.originSelect;
  }

  async getOriginSelectedOption() {
    return this.originSelect.element(by.css('option:checked')).getText();
  }

  async destinySelectLastOption() {
    await this.destinySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async destinySelectOption(option) {
    await this.destinySelect.sendKeys(option);
  }

  getDestinySelect() {
    return this.destinySelect;
  }

  async getDestinySelectedOption() {
    return this.destinySelect.element(by.css('option:checked')).getText();
  }

  async manouverSelectLastOption() {
    await this.manouverSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async manouverSelectOption(option) {
    await this.manouverSelect.sendKeys(option);
  }

  getManouverSelect() {
    return this.manouverSelect;
  }

  async getManouverSelectedOption() {
    return this.manouverSelect.element(by.css('option:checked')).getText();
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
