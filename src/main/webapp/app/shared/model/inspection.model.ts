import { Moment } from 'moment';
import { ILocation } from 'app/shared/model/location.model';

export interface IInspection {
  id?: number;
  date?: Moment;
  signatureContentType?: string;
  signature?: any;
  location?: ILocation;
}

export const defaultValue: Readonly<IInspection> = {};
