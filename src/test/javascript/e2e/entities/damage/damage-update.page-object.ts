import { element, by, ElementFinder } from 'protractor';

export default class DamageUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.damage.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  reportDateInput: ElementFinder = element(by.css('input#damage-reportDate'));
  descriptionInput: ElementFinder = element(by.css('input#damage-description'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setReportDateInput(reportDate) {
    await this.reportDateInput.sendKeys(reportDate);
  }

  async getReportDateInput() {
    return this.reportDateInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
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
