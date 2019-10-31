import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Glossary } from 'app/shared/model/glossary.model';
import { GlossaryService } from './glossary.service';
import { GlossaryComponent } from './glossary.component';
import { GlossaryDetailComponent } from './glossary-detail.component';
import { GlossaryUpdateComponent } from './glossary-update.component';
import { GlossaryDeletePopupComponent } from './glossary-delete-dialog.component';
import { IGlossary } from 'app/shared/model/glossary.model';

@Injectable({ providedIn: 'root' })
export class GlossaryResolve implements Resolve<IGlossary> {
  constructor(private service: GlossaryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGlossary> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Glossary>) => response.ok),
        map((glossary: HttpResponse<Glossary>) => glossary.body)
      );
    }
    return of(new Glossary());
  }
}

export const glossaryRoute: Routes = [
  {
    path: '',
    component: GlossaryComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.glossary.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GlossaryDetailComponent,
    resolve: {
      glossary: GlossaryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.glossary.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GlossaryUpdateComponent,
    resolve: {
      glossary: GlossaryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.glossary.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GlossaryUpdateComponent,
    resolve: {
      glossary: GlossaryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.glossary.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const glossaryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GlossaryDeletePopupComponent,
    resolve: {
      glossary: GlossaryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.glossary.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
