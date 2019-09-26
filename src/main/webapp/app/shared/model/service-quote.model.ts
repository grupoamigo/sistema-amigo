import { Moment } from 'moment';
import { IContract } from 'app/shared/model/contract.model';
import { IServiceRequest } from 'app/shared/model/service-request.model';
import { ServiceUnitType } from 'app/shared/model/enumerations/service-unit-type.model';
import { StatusType } from 'app/shared/model/enumerations/status-type.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IServiceQuote {
  id?: number;
  title?: string;
  description?: string;
  quantity?: number;
  price?: number;
  unit?: ServiceUnitType;
  expeditionDate?: Moment;
  expirationDate?: Moment;
  status?: StatusType;
  currency?: CurrencyType;
  approvedBy?: string;
  qrCodeContentType?: string;
  qrCode?: any;
  contract?: IContract;
  serviceRequests?: IServiceRequest[];
}

export const defaultValue: Readonly<IServiceQuote> = {};
