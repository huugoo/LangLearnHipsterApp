import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { GlossaryDeleteDialogComponent } from 'app/entities/glossary/glossary-delete-dialog.component';
import { GlossaryService } from 'app/entities/glossary/glossary.service';

describe('Component Tests', () => {
  describe('Glossary Management Delete Component', () => {
    let comp: GlossaryDeleteDialogComponent;
    let fixture: ComponentFixture<GlossaryDeleteDialogComponent>;
    let service: GlossaryService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [GlossaryDeleteDialogComponent]
      })
        .overrideTemplate(GlossaryDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GlossaryDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GlossaryService);
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
