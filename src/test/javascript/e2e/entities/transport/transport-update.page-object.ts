import { element, by, ElementFinder } from 'protractor';

export default class TransportUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.transport.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  plateIdInput: ElementFinder = element(by.css('input#transport-plateId'));
  typeSelect: ElementFinder = element(by.css('select#transport-type'));
  ownerSelect: ElementFinder = element(by.css('select#transport-owner'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setPlateIdInput(plateId) {
    await this.plateIdInput.sendKeys(plateId);
  }

  async getPlateIdInput() {
    return this.plateIdInput.getAttribute('value');
  }

  async setTypeSelect(type) {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect() {
    return this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption() {
    await this.typeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async ownerSelectLastOption() {
    await this.ownerSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async ownerSelectOption(option) {
    await this.ownerSelect.sendKeys(option);
  }

  getOwnerSelect() {
    return this.ownerSelect;
  }

  async getOwnerSelectedOption() {
    return this.ownerSelect.element(by.css('option:checked')).getText();
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
