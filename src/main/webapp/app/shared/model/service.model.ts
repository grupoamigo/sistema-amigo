import { ICompany } from 'app/shared/model/company.model';
import { ServiceType } from 'app/shared/model/enumerations/service-type.model';
import { ServiceUnitType } from 'app/shared/model/enumerations/service-unit-type.model';
import { StatusType } from 'app/shared/model/enumerations/status-type.model';

export interface IService {
  id?: number;
  title?: string;
  description?: string;
  type?: ServiceType;
  unit?: ServiceUnitType;
  status?: StatusType;
  company?: ICompany;
}

export const defaultValue: Readonly<IService> = {};
