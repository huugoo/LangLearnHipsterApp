import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IGlossary, Glossary } from 'app/shared/model/glossary.model';
import { GlossaryService } from './glossary.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IWords } from 'app/shared/model/words.model';
import { WordsService } from 'app/entities/words/words.service';

@Component({
  selector: 'jhi-glossary-update',
  templateUrl: './glossary-update.component.html'
})
export class GlossaryUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  words: IWords[];

  editForm = this.fb.group({
    id: [],
    glosName: [],
    lang1: [],
    lang2: [],
    user: [],
    words: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected glossaryService: GlossaryService,
    protected userService: UserService,
    protected wordsService: WordsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ glossary }) => {
      this.updateForm(glossary);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.wordsService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IWords[]>) => mayBeOk.ok),
        map((response: HttpResponse<IWords[]>) => response.body)
      )
      .subscribe((res: IWords[]) => (this.words = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(glossary: IGlossary) {
    this.editForm.patchValue({
      id: glossary.id,
      glosName: glossary.glosName,
      lang1: glossary.lang1,
      lang2: glossary.lang2,
      user: glossary.user,
      words: glossary.words
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const glossary = this.createFromForm();
    if (glossary.id !== undefined) {
      this.subscribeToSaveResponse(this.glossaryService.update(glossary));
    } else {
      this.subscribeToSaveResponse(this.glossaryService.create(glossary));
    }
  }

  private createFromForm(): IGlossary {
    return {
      ...new Glossary(),
      id: this.editForm.get(['id']).value,
      glosName: this.editForm.get(['glosName']).value,
      lang1: this.editForm.get(['lang1']).value,
      lang2: this.editForm.get(['lang2']).value,
      user: this.editForm.get(['user']).value,
      words: this.editForm.get(['words']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGlossary>>) {
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackWordsById(index: number, item: IWords) {
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
