import { element, by, ElementFinder } from 'protractor';

export default class SealUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.seal.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  issuerInput: ElementFinder = element(by.css('input#seal-issuer'));
  uniqueIdInput: ElementFinder = element(by.css('input#seal-uniqueId'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setIssuerInput(issuer) {
    await this.issuerInput.sendKeys(issuer);
  }

  async getIssuerInput() {
    return this.issuerInput.getAttribute('value');
  }

  async setUniqueIdInput(uniqueId) {
    await this.uniqueIdInput.sendKeys(uniqueId);
  }

  async getUniqueIdInput() {
    return this.uniqueIdInput.getAttribute('value');
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
