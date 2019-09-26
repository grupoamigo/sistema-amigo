import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IRoute {
  id?: number;
  price?: number;
  name?: string;
  currency?: CurrencyType;
}

export const defaultValue: Readonly<IRoute> = {};
