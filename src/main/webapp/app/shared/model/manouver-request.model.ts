import { Moment } from 'moment';
import { ILocation } from 'app/shared/model/location.model';
import { IManouver } from 'app/shared/model/manouver.model';
import { TransportType } from 'app/shared/model/enumerations/transport-type.model';

export interface IManouverRequest {
  id?: number;
  title?: string;
  description?: string;
  date?: Moment;
  transportType?: TransportType;
  qrCodeContentType?: string;
  qrCode?: any;
  origin?: ILocation;
  destiny?: ILocation;
  manouver?: IManouver;
}

export const defaultValue: Readonly<IManouverRequest> = {};
