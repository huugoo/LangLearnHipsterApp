import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Words } from 'app/shared/model/words.model';
import { WordsService } from './words.service';
import { WordsComponent } from './words.component';
import { WordsDetailComponent } from './words-detail.component';
import { WordsUpdateComponent } from './words-update.component';
import { WordsDeletePopupComponent } from './words-delete-dialog.component';
import { IWords } from 'app/shared/model/words.model';

@Injectable({ providedIn: 'root' })
export class WordsResolve implements Resolve<IWords> {
  constructor(private service: WordsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWords> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Words>) => response.ok),
        map((words: HttpResponse<Words>) => words.body)
      );
    }
    return of(new Words());
  }
}

export const wordsRoute: Routes = [
  {
    path: '',
    component: WordsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.words.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WordsDetailComponent,
    resolve: {
      words: WordsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.words.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WordsUpdateComponent,
    resolve: {
      words: WordsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.words.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WordsUpdateComponent,
    resolve: {
      words: WordsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.words.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const wordsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WordsDeletePopupComponent,
    resolve: {
      words: WordsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'langLearnHipsterApp.words.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
