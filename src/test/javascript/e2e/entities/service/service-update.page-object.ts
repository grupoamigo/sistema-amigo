import { element, by, ElementFinder } from 'protractor';

export default class ServiceUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.service.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#service-title'));
  descriptionInput: ElementFinder = element(by.css('input#service-description'));
  typeSelect: ElementFinder = element(by.css('select#service-type'));
  unitSelect: ElementFinder = element(by.css('select#service-unit'));
  statusSelect: ElementFinder = element(by.css('select#service-status'));
  companySelect: ElementFinder = element(by.css('select#service-company'));

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
  async setUnitSelect(unit) {
    await this.unitSelect.sendKeys(unit);
  }

  async getUnitSelect() {
    return this.unitSelect.element(by.css('option:checked')).getText();
  }

  async unitSelectLastOption() {
    await this.unitSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async companySelectLastOption() {
    await this.companySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async companySelectOption(option) {
    await this.companySelect.sendKeys(option);
  }

  getCompanySelect() {
    return this.companySelect;
  }

  async getCompanySelectedOption() {
    return this.companySelect.element(by.css('option:checked')).getText();
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
