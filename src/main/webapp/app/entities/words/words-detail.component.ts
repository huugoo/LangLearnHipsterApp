import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWords } from 'app/shared/model/words.model';

@Component({
  selector: 'jhi-words-detail',
  templateUrl: './words-detail.component.html'
})
export class WordsDetailComponent implements OnInit {
  words: IWords;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ words }) => {
      this.words = words;
    });
  }

  previousState() {
    window.history.back();
  }
}
