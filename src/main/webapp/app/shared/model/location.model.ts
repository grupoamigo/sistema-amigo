import { Moment } from 'moment';
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { IInspection } from 'app/shared/model/inspection.model';

export interface ILocation {
  id?: number;
  address?: string;
  lat?: string;
  lng?: string;
  timestamp?: Moment;
  manouverRequestOrigin?: IManouverRequest;
  manouverRequestDestiny?: IManouverRequest;
  inspection?: IInspection;
}

export const defaultValue: Readonly<ILocation> = {};
