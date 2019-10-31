import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LangLearnHipsterAppTestModule } from '../../../test.module';
import { GlossaryDetailComponent } from 'app/entities/glossary/glossary-detail.component';
import { Glossary } from 'app/shared/model/glossary.model';

describe('Component Tests', () => {
  describe('Glossary Management Detail Component', () => {
    let comp: GlossaryDetailComponent;
    let fixture: ComponentFixture<GlossaryDetailComponent>;
    const route = ({ data: of({ glossary: new Glossary(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LangLearnHipsterAppTestModule],
        declarations: [GlossaryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(GlossaryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GlossaryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.glossary).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
