import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { GlossaryUpdateComponent } from 'app/entities/glossary/glossary-update.component';
import { GlossaryService } from 'app/entities/glossary/glossary.service';
import { Glossary } from 'app/shared/model/glossary.model';

describe('Component Tests', () => {
  describe('Glossary Management Update Component', () => {
    let comp: GlossaryUpdateComponent;
    let fixture: ComponentFixture<GlossaryUpdateComponent>;
    let service: GlossaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [GlossaryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(GlossaryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GlossaryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GlossaryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Glossary(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Glossary();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
