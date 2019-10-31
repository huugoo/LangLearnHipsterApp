import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LangLearnHipsterAppSharedModule } from 'app/shared/shared.module';
import { WordsComponent } from './words.component';
import { WordsDetailComponent } from './words-detail.component';
import { WordsUpdateComponent } from './words-update.component';
import { WordsDeletePopupComponent, WordsDeleteDialogComponent } from './words-delete-dialog.component';
import { wordsRoute, wordsPopupRoute } from './words.route';

const ENTITY_STATES = [...wordsRoute, ...wordsPopupRoute];

@NgModule({
  imports: [LangLearnHipsterAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [WordsComponent, WordsDetailComponent, WordsUpdateComponent, WordsDeleteDialogComponent, WordsDeletePopupComponent],
  entryComponents: [WordsDeleteDialogComponent]
})
export class LangLearnHipsterAppWordsModule {}
