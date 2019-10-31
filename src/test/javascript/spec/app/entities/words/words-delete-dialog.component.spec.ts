import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { WordsDeleteDialogComponent } from 'app/entities/words/words-delete-dialog.component';
import { WordsService } from 'app/entities/words/words.service';

describe('Component Tests', () => {
  describe('Words Management Delete Component', () => {
    let comp: WordsDeleteDialogComponent;
    let fixture: ComponentFixture<WordsDeleteDialogComponent>;
    let service: WordsService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [WordsDeleteDialogComponent]
      })
        .overrideTemplate(WordsDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WordsDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WordsService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
