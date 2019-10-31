import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IWords, Words } from 'app/shared/model/words.model';
import { WordsService } from './words.service';
import { IGlossary } from 'app/shared/model/glossary.model';
import { GlossaryService } from 'app/entities/glossary/glossary.service';

@Component({
  selector: 'jhi-words-update',
  templateUrl: './words-update.component.html'
})
export class WordsUpdateComponent implements OnInit {
  isSaving: boolean;

  glossaries: IGlossary[];

  editForm = this.fb.group({
    id: [],
    wordLang1: [],
    wordLang2: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected wordsService: WordsService,
    protected glossaryService: GlossaryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ words }) => {
      this.updateForm(words);
    });
    this.glossaryService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IGlossary[]>) => mayBeOk.ok),
        map((response: HttpResponse<IGlossary[]>) => response.body)
      )
      .subscribe((res: IGlossary[]) => (this.glossaries = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(words: IWords) {
    this.editForm.patchValue({
      id: words.id,
      wordLang1: words.wordLang1,
      wordLang2: words.wordLang2
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const words = this.createFromForm();
    if (words.id !== undefined) {
      this.subscribeToSaveResponse(this.wordsService.update(words));
    } else {
      this.subscribeToSaveResponse(this.wordsService.create(words));
    }
  }

  private createFromForm(): IWords {
    return {
      ...new Words(),
      id: this.editForm.get(['id']).value,
      wordLang1: this.editForm.get(['wordLang1']).value,
      wordLang2: this.editForm.get(['wordLang2']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWords>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackGlossaryById(index: number, item: IGlossary) {
    return item.id;
  }

  getSelected(selectedVals: any[], option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
