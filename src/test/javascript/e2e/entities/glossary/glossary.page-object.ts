import { element, by, ElementFinder } from 'protractor';

export class GlossaryComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-glossary div table .btn-danger'));
  title = element.all(by.css('jhi-glossary div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class GlossaryUpdatePage {
  pageTitle = element(by.id('jhi-glossary-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  glosNameInput = element(by.id('field_glosName'));
  lang1Input = element(by.id('field_lang1'));
  lang2Input = element(by.id('field_lang2'));
  userSelect = element(by.id('field_user'));
  wordsSelect = element(by.id('field_words'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setGlosNameInput(glosName) {
    await this.glosNameInput.sendKeys(glosName);
  }

  async getGlosNameInput() {
    return await this.glosNameInput.getAttribute('value');
  }

  async setLang1Input(lang1) {
    await this.lang1Input.sendKeys(lang1);
  }

  async getLang1Input() {
    return await this.lang1Input.getAttribute('value');
  }

  async setLang2Input(lang2) {
    await this.lang2Input.sendKeys(lang2);
  }

  async getLang2Input() {
    return await this.lang2Input.getAttribute('value');
  }

  async userSelectLastOption(timeout?: number) {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async wordsSelectLastOption(timeout?: number) {
    await this.wordsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async wordsSelectOption(option) {
    await this.wordsSelect.sendKeys(option);
  }

  getWordsSelect(): ElementFinder {
    return this.wordsSelect;
  }

  async getWordsSelectedOption() {
    return await this.wordsSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class GlossaryDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-glossary-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-glossary'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
