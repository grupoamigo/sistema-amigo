import { element, by, ElementFinder } from 'protractor';

export default class InspectionUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.inspection.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateInput: ElementFinder = element(by.css('input#inspection-date'));
  signatureInput: ElementFinder = element(by.css('input#file_signature'));
  locationSelect: ElementFinder = element(by.css('select#inspection-location'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateInput(date) {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return this.dateInput.getAttribute('value');
  }

  async setSignatureInput(signature) {
    await this.signatureInput.sendKeys(signature);
  }

  async getSignatureInput() {
    return this.signatureInput.getAttribute('value');
  }

  async locationSelectLastOption() {
    await this.locationSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async locationSelectOption(option) {
    await this.locationSelect.sendKeys(option);
  }

  getLocationSelect() {
    return this.locationSelect;
  }

  async getLocationSelectedOption() {
    return this.locationSelect.element(by.css('option:checked')).getText();
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
