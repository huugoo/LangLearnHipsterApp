// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WordsComponentsPage, WordsDeleteDialog, WordsUpdatePage } from './words.page-object';

const expect = chai.expect;

describe('Words e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let wordsComponentsPage: WordsComponentsPage;
  let wordsUpdatePage: WordsUpdatePage;
  let wordsDeleteDialog: WordsDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Words', async () => {
    await navBarPage.goToEntity('words');
    wordsComponentsPage = new WordsComponentsPage();
    await browser.wait(ec.visibilityOf(wordsComponentsPage.title), 5000);
    expect(await wordsComponentsPage.getTitle()).to.eq('langLearnHipsterApp.words.home.title');
  });

  it('should load create Words page', async () => {
    await wordsComponentsPage.clickOnCreateButton();
    wordsUpdatePage = new WordsUpdatePage();
    expect(await wordsUpdatePage.getPageTitle()).to.eq('langLearnHipsterApp.words.home.createOrEditLabel');
    await wordsUpdatePage.cancel();
  });

  it('should create and save Words', async () => {
    const nbButtonsBeforeCreate = await wordsComponentsPage.countDeleteButtons();

    await wordsComponentsPage.clickOnCreateButton();
    await promise.all([wordsUpdatePage.setWordLang1Input('wordLang1'), wordsUpdatePage.setWordLang2Input('wordLang2')]);
    expect(await wordsUpdatePage.getWordLang1Input()).to.eq('wordLang1', 'Expected WordLang1 value to be equals to wordLang1');
    expect(await wordsUpdatePage.getWordLang2Input()).to.eq('wordLang2', 'Expected WordLang2 value to be equals to wordLang2');
    await wordsUpdatePage.save();
    expect(await wordsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await wordsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Words', async () => {
    const nbButtonsBeforeDelete = await wordsComponentsPage.countDeleteButtons();
    await wordsComponentsPage.clickOnLastDeleteButton();

    wordsDeleteDialog = new WordsDeleteDialog();
    expect(await wordsDeleteDialog.getDialogTitle()).to.eq('langLearnHipsterApp.words.delete.question');
    await wordsDeleteDialog.clickOnConfirmButton();

    expect(await wordsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
