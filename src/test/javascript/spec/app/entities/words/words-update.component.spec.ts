import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { WordsUpdateComponent } from 'app/entities/words/words-update.component';
import { WordsService } from 'app/entities/words/words.service';
import { Words } from 'app/shared/model/words.model';

describe('Component Tests', () => {
  describe('Words Management Update Component', () => {
    let comp: WordsUpdateComponent;
    let fixture: ComponentFixture<WordsUpdateComponent>;
    let service: WordsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [WordsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WordsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WordsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WordsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Words(123);
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
        const entity = new Words();
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
