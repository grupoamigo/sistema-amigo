import { ContactType } from 'app/shared/model/enumerations/contact-type.model';

export interface IContactCard {
  id?: number;
  type?: ContactType;
  value?: string;
}

export const defaultValue: Readonly<IContactCard> = {};
