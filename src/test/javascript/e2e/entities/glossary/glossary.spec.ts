// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GlossaryComponentsPage, GlossaryDeleteDialog, GlossaryUpdatePage } from './glossary.page-object';

const expect = chai.expect;

describe('Glossary e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let glossaryComponentsPage: GlossaryComponentsPage;
  let glossaryUpdatePage: GlossaryUpdatePage;
  let glossaryDeleteDialog: GlossaryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Glossaries', async () => {
    await navBarPage.goToEntity('glossary');
    glossaryComponentsPage = new GlossaryComponentsPage();
    await browser.wait(ec.visibilityOf(glossaryComponentsPage.title), 5000);
    expect(await glossaryComponentsPage.getTitle()).to.eq('langLearnHipsterApp.glossary.home.title');
  });

  it('should load create Glossary page', async () => {
    await glossaryComponentsPage.clickOnCreateButton();
    glossaryUpdatePage = new GlossaryUpdatePage();
    expect(await glossaryUpdatePage.getPageTitle()).to.eq('langLearnHipsterApp.glossary.home.createOrEditLabel');
    await glossaryUpdatePage.cancel();
  });

  it('should create and save Glossaries', async () => {
    const nbButtonsBeforeCreate = await glossaryComponentsPage.countDeleteButtons();

    await glossaryComponentsPage.clickOnCreateButton();
    await promise.all([
      glossaryUpdatePage.setGlosNameInput('glosName'),
      glossaryUpdatePage.setLang1Input('lang1'),
      glossaryUpdatePage.setLang2Input('lang2'),
      glossaryUpdatePage.userSelectLastOption()
      // glossaryUpdatePage.wordsSelectLastOption(),
    ]);
    expect(await glossaryUpdatePage.getGlosNameInput()).to.eq('glosName', 'Expected GlosName value to be equals to glosName');
    expect(await glossaryUpdatePage.getLang1Input()).to.eq('lang1', 'Expected Lang1 value to be equals to lang1');
    expect(await glossaryUpdatePage.getLang2Input()).to.eq('lang2', 'Expected Lang2 value to be equals to lang2');
    await glossaryUpdatePage.save();
    expect(await glossaryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await glossaryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Glossary', async () => {
    const nbButtonsBeforeDelete = await glossaryComponentsPage.countDeleteButtons();
    await glossaryComponentsPage.clickOnLastDeleteButton();

    glossaryDeleteDialog = new GlossaryDeleteDialog();
    expect(await glossaryDeleteDialog.getDialogTitle()).to.eq('langLearnHipsterApp.glossary.delete.question');
    await glossaryDeleteDialog.clickOnConfirmButton();

    expect(await glossaryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
