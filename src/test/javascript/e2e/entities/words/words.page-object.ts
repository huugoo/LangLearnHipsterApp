import { element, by, ElementFinder } from 'protractor';

export class WordsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-words div table .btn-danger'));
  title = element.all(by.css('jhi-words div h2#page-heading span')).first();

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

export class WordsUpdatePage {
  pageTitle = element(by.id('jhi-words-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  wordLang1Input = element(by.id('field_wordLang1'));
  wordLang2Input = element(by.id('field_wordLang2'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setWordLang1Input(wordLang1) {
    await this.wordLang1Input.sendKeys(wordLang1);
  }

  async getWordLang1Input() {
    return await this.wordLang1Input.getAttribute('value');
  }

  async setWordLang2Input(wordLang2) {
    await this.wordLang2Input.sendKeys(wordLang2);
  }

  async getWordLang2Input() {
    return await this.wordLang2Input.getAttribute('value');
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

export class WordsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-words-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-words'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
