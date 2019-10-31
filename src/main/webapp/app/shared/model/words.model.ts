import { IGlossary } from 'app/shared/model/glossary.model';

export interface IWords {
  id?: number;
  wordLang1?: string;
  wordLang2?: string;
  glossaries?: IGlossary[];
}

export class Words implements IWords {
  constructor(public id?: number, public wordLang1?: string, public wordLang2?: string, public glossaries?: IGlossary[]) {}
}
