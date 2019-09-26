import { IMembership } from 'app/shared/model/membership.model';
import { IContract } from 'app/shared/model/contract.model';
import { IService } from 'app/shared/model/service.model';
import { IWarehouse } from 'app/shared/model/warehouse.model';
import { IManouver } from 'app/shared/model/manouver.model';
import { ITransport } from 'app/shared/model/transport.model';
import { CompanyType } from 'app/shared/model/enumerations/company-type.model';

export interface ICompany {
  id?: number;
  legalName?: string;
  taxId?: string;
  type?: CompanyType;
  logoContentType?: string;
  logo?: any;
  profilePictureContentType?: string;
  profilePicture?: any;
  memberships?: IMembership[];
  contracts?: IContract[];
  service?: IService;
  warehouse?: IWarehouse;
  manouver?: IManouver;
  transportOwners?: ITransport[];
}

export const defaultValue: Readonly<ICompany> = {};
