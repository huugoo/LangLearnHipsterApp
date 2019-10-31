import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IWords } from 'app/shared/model/words.model';

type EntityResponseType = HttpResponse<IWords>;
type EntityArrayResponseType = HttpResponse<IWords[]>;

@Injectable({ providedIn: 'root' })
export class WordsService {
  public resourceUrl = SERVER_API_URL + 'api/words';

  constructor(protected http: HttpClient) {}

  create(words: IWords): Observable<EntityResponseType> {
    return this.http.post<IWords>(this.resourceUrl, words, { observe: 'response' });
  }

  update(words: IWords): Observable<EntityResponseType> {
    return this.http.put<IWords>(this.resourceUrl, words, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWords>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWords[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
