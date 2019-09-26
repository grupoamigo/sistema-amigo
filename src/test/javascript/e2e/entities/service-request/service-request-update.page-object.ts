import { element, by, ElementFinder } from 'protractor';

export default class ServiceRequestUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.serviceRequest.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#service-request-title'));
  descriptionInput: ElementFinder = element(by.css('input#service-request-description'));
  dateRequestedInput: ElementFinder = element(by.css('input#service-request-dateRequested'));
  dateBeginInput: ElementFinder = element(by.css('input#service-request-dateBegin'));
  dateEndInput: ElementFinder = element(by.css('input#service-request-dateEnd'));
  statusSelect: ElementFinder = element(by.css('select#service-request-status'));
  clientSelect: ElementFinder = element(by.css('select#service-request-client'));
  serviceQuoteSelect: ElementFinder = element(by.css('select#service-request-serviceQuote'));

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

  async setDateRequestedInput(dateRequested) {
    await this.dateRequestedInput.sendKeys(dateRequested);
  }

  async getDateRequestedInput() {
    return this.dateRequestedInput.getAttribute('value');
  }

  async setDateBeginInput(dateBegin) {
    await this.dateBeginInput.sendKeys(dateBegin);
  }

  async getDateBeginInput() {
    return this.dateBeginInput.getAttribute('value');
  }

  async setDateEndInput(dateEnd) {
    await this.dateEndInput.sendKeys(dateEnd);
  }

  async getDateEndInput() {
    return this.dateEndInput.getAttribute('value');
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
  async clientSelectLastOption() {
    await this.clientSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async clientSelectOption(option) {
    await this.clientSelect.sendKeys(option);
  }

  getClientSelect() {
    return this.clientSelect;
  }

  async getClientSelectedOption() {
    return this.clientSelect.element(by.css('option:checked')).getText();
  }

  async serviceQuoteSelectLastOption() {
    await this.serviceQuoteSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async serviceQuoteSelectOption(option) {
    await this.serviceQuoteSelect.sendKeys(option);
  }

  getServiceQuoteSelect() {
    return this.serviceQuoteSelect;
  }

  async getServiceQuoteSelectedOption() {
    return this.serviceQuoteSelect.element(by.css('option:checked')).getText();
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
