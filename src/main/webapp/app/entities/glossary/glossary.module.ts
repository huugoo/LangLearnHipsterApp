import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LangLearnHipsterAppSharedModule } from 'app/shared/shared.module';
import { GlossaryComponent } from './glossary.component';
import { GlossaryDetailComponent } from './glossary-detail.component';
import { GlossaryUpdateComponent } from './glossary-update.component';
import { GlossaryDeletePopupComponent, GlossaryDeleteDialogComponent } from './glossary-delete-dialog.component';
import { glossaryRoute, glossaryPopupRoute } from './glossary.route';

const ENTITY_STATES = [...glossaryRoute, ...glossaryPopupRoute];

@NgModule({
  imports: [LangLearnHipsterAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GlossaryComponent,
    GlossaryDetailComponent,
    GlossaryUpdateComponent,
    GlossaryDeleteDialogComponent,
    GlossaryDeletePopupComponent
  ],
  entryComponents: [GlossaryDeleteDialogComponent]
})
export class LangLearnHipsterAppGlossaryModule {}
