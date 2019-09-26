import { element, by, ElementFinder } from 'protractor';

export default class ServiceQuoteUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.serviceQuote.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#service-quote-title'));
  descriptionInput: ElementFinder = element(by.css('input#service-quote-description'));
  quantityInput: ElementFinder = element(by.css('input#service-quote-quantity'));
  priceInput: ElementFinder = element(by.css('input#service-quote-price'));
  unitSelect: ElementFinder = element(by.css('select#service-quote-unit'));
  expeditionDateInput: ElementFinder = element(by.css('input#service-quote-expeditionDate'));
  expirationDateInput: ElementFinder = element(by.css('input#service-quote-expirationDate'));
  statusSelect: ElementFinder = element(by.css('select#service-quote-status'));
  currencySelect: ElementFinder = element(by.css('select#service-quote-currency'));
  approvedByInput: ElementFinder = element(by.css('input#service-quote-approvedBy'));
  qrCodeInput: ElementFinder = element(by.css('input#file_qrCode'));
  contractSelect: ElementFinder = element(by.css('select#service-quote-contract'));

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

  async setQuantityInput(quantity) {
    await this.quantityInput.sendKeys(quantity);
  }

  async getQuantityInput() {
    return this.quantityInput.getAttribute('value');
  }

  async setPriceInput(price) {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput() {
    return this.priceInput.getAttribute('value');
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
  async setExpeditionDateInput(expeditionDate) {
    await this.expeditionDateInput.sendKeys(expeditionDate);
  }

  async getExpeditionDateInput() {
    return this.expeditionDateInput.getAttribute('value');
  }

  async setExpirationDateInput(expirationDate) {
    await this.expirationDateInput.sendKeys(expirationDate);
  }

  async getExpirationDateInput() {
    return this.expirationDateInput.getAttribute('value');
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
  async setApprovedByInput(approvedBy) {
    await this.approvedByInput.sendKeys(approvedBy);
  }

  async getApprovedByInput() {
    return this.approvedByInput.getAttribute('value');
  }

  async setQrCodeInput(qrCode) {
    await this.qrCodeInput.sendKeys(qrCode);
  }

  async getQrCodeInput() {
    return this.qrCodeInput.getAttribute('value');
  }

  async contractSelectLastOption() {
    await this.contractSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async contractSelectOption(option) {
    await this.contractSelect.sendKeys(option);
  }

  getContractSelect() {
    return this.contractSelect;
  }

  async getContractSelectedOption() {
    return this.contractSelect.element(by.css('option:checked')).getText();
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
