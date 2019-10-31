import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IGlossary } from 'app/shared/model/glossary.model';

type EntityResponseType = HttpResponse<IGlossary>;
type EntityArrayResponseType = HttpResponse<IGlossary[]>;

@Injectable({ providedIn: 'root' })
export class GlossaryService {
  public resourceUrl = SERVER_API_URL + 'api/glossaries';

  constructor(protected http: HttpClient) {}

  create(glossary: IGlossary): Observable<EntityResponseType> {
    return this.http.post<IGlossary>(this.resourceUrl, glossary, { observe: 'response' });
  }

  update(glossary: IGlossary): Observable<EntityResponseType> {
    return this.http.put<IGlossary>(this.resourceUrl, glossary, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGlossary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGlossary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
