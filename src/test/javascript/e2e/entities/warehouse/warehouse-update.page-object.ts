import { element, by, ElementFinder } from 'protractor';

export default class WarehouseUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.warehouse.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#warehouse-name'));
  divisionSelect: ElementFinder = element(by.css('select#warehouse-division'));
  ownerSelect: ElementFinder = element(by.css('select#warehouse-owner'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setDivisionSelect(division) {
    await this.divisionSelect.sendKeys(division);
  }

  async getDivisionSelect() {
    return this.divisionSelect.element(by.css('option:checked')).getText();
  }

  async divisionSelectLastOption() {
    await this.divisionSelect
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
