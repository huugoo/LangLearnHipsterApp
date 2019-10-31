import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGlossary } from 'app/shared/model/glossary.model';

@Component({
  selector: 'jhi-glossary-detail',
  templateUrl: './glossary-detail.component.html'
})
export class GlossaryDetailComponent implements OnInit {
  glossary: IGlossary;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ glossary }) => {
      this.glossary = glossary;
    });
  }

  previousState() {
    window.history.back();
  }
}
