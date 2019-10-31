import { IUser } from 'app/core/user/user.model';
import { IWords } from 'app/shared/model/words.model';

export interface IGlossary {
  id?: number;
  glosName?: string;
  lang1?: string;
  lang2?: string;
  user?: IUser;
  words?: IWords[];
}

export class Glossary implements IGlossary {
  constructor(
    public id?: number,
    public glosName?: string,
    public lang1?: string,
    public lang2?: string,
    public user?: IUser,
    public words?: IWords[]
  ) {}
}
