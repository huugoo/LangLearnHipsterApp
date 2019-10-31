import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGlossary } from 'app/shared/model/glossary.model';
import { GlossaryService } from './glossary.service';

@Component({
  selector: 'jhi-glossary-delete-dialog',
  templateUrl: './glossary-delete-dialog.component.html'
})
export class GlossaryDeleteDialogComponent {
  glossary: IGlossary;

  constructor(protected glossaryService: GlossaryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.glossaryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'glossaryListModification',
        content: 'Deleted an glossary'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-glossary-delete-popup',
  template: ''
})
export class GlossaryDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ glossary }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GlossaryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.glossary = glossary;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/glossary', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/glossary', { outlets: { popup: null } }]);
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
