import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'glossary',
        loadChildren: () => import('./glossary/glossary.module').then(m => m.LangLearnHipsterAppGlossaryModule)
      },
      {
        path: 'words',
        loadChildren: () => import('./words/words.module').then(m => m.LangLearnHipsterAppWordsModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class LangLearnHipsterAppEntityModule {}
