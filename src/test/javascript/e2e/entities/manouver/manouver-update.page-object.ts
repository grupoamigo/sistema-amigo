import { element, by, ElementFinder } from 'protractor';

export default class ManouverUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.manouver.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#manouver-title'));
  descriptionInput: ElementFinder = element(by.css('input#manouver-description'));
  unitSelect: ElementFinder = element(by.css('select#manouver-unit'));
  divisionSelect: ElementFinder = element(by.css('select#manouver-division'));
  priceInput: ElementFinder = element(by.css('input#manouver-price'));
  currencySelect: ElementFinder = element(by.css('select#manouver-currency'));
  providerSelect: ElementFinder = element(by.css('select#manouver-provider'));

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
  async setPriceInput(price) {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput() {
    return this.priceInput.getAttribute('value');
  }

  async setCurrencySelect(currency) {
    await this.currencySelect.sendKeys(currency);
  }

  async getCurrencySelect() {
    return this.currencySelect.element(by.css('option:checked')).getText();
  }

  async currencySelectLastOption() {
    await this.currencySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async providerSelectLastOption() {
    await this.providerSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async providerSelectOption(option) {
    await this.providerSelect.sendKeys(option);
  }

  getProviderSelect() {
    return this.providerSelect;
  }

  async getProviderSelectedOption() {
    return this.providerSelect.element(by.css('option:checked')).getText();
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
