import { element, by, ElementFinder } from 'protractor';

export default class CompanyUpdatePage {
  pageTitle: ElementFinder = element(by.id('sistemaAmigoApp.company.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  legalNameInput: ElementFinder = element(by.css('input#company-legalName'));
  taxIdInput: ElementFinder = element(by.css('input#company-taxId'));
  typeSelect: ElementFinder = element(by.css('select#company-type'));
  logoInput: ElementFinder = element(by.css('input#file_logo'));
  profilePictureInput: ElementFinder = element(by.css('input#file_profilePicture'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setLegalNameInput(legalName) {
    await this.legalNameInput.sendKeys(legalName);
  }

  async getLegalNameInput() {
    return this.legalNameInput.getAttribute('value');
  }

  async setTaxIdInput(taxId) {
    await this.taxIdInput.sendKeys(taxId);
  }

  async getTaxIdInput() {
    return this.taxIdInput.getAttribute('value');
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
  async setLogoInput(logo) {
    await this.logoInput.sendKeys(logo);
  }

  async getLogoInput() {
    return this.logoInput.getAttribute('value');
  }

  async setProfilePictureInput(profilePicture) {
    await this.profilePictureInput.sendKeys(profilePicture);
  }

  async getProfilePictureInput() {
    return this.profilePictureInput.getAttribute('value');
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
