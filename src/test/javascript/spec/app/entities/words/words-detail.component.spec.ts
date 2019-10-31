import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { WordsDetailComponent } from 'app/entities/words/words-detail.component';
import { Words } from 'app/shared/model/words.model';

describe('Component Tests', () => {
  describe('Words Management Detail Component', () => {
    let comp: WordsDetailComponent;
    let fixture: ComponentFixture<WordsDetailComponent>;
    const route = ({ data: of({ words: new Words(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [WordsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WordsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WordsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.words).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
