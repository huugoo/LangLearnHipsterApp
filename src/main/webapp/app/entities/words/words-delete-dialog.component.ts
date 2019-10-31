import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWords } from 'app/shared/model/words.model';
import { WordsService } from './words.service';

@Component({
  selector: 'jhi-words-delete-dialog',
  templateUrl: './words-delete-dialog.component.html'
})
export class WordsDeleteDialogComponent {
  words: IWords;

  constructor(protected wordsService: WordsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.wordsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'wordsListModification',
        content: 'Deleted an words'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-words-delete-popup',
  template: ''
})
export class WordsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ words }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WordsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.words = words;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/words', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/words', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
