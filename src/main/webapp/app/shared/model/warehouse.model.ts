import { ICompany } from 'app/shared/model/company.model';
import { ICargo } from 'app/shared/model/cargo.model';
import { DivisionType } from 'app/shared/model/enumerations/division-type.model';

export interface IWarehouse {
  id?: number;
  name?: string;
  division?: DivisionType;
  owner?: ICompany;
  cargoLists?: ICargo[];
  cargo?: ICargo;
}

export const defaultValue: Readonly<IWarehouse> = {};
