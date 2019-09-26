import { ICompany } from 'app/shared/model/company.model';
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { ServiceUnitType } from 'app/shared/model/enumerations/service-unit-type.model';
import { DivisionType } from 'app/shared/model/enumerations/division-type.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IManouver {
  id?: number;
  title?: string;
  description?: string;
  unit?: ServiceUnitType;
  division?: DivisionType;
  price?: number;
  currency?: CurrencyType;
  provider?: ICompany;
  manouverRequest?: IManouverRequest;
}

export const defaultValue: Readonly<IManouver> = {};
