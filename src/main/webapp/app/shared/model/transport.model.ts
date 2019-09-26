import { ICompany } from 'app/shared/model/company.model';
import { TransportType } from 'app/shared/model/enumerations/transport-type.model';

export interface ITransport {
  id?: number;
  plateId?: string;
  type?: TransportType;
  owner?: ICompany;
}

export const defaultValue: Readonly<ITransport> = {};
