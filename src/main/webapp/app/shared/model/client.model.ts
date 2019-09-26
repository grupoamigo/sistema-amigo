import { Moment } from 'moment';
import { IServiceRequest } from 'app/shared/model/service-request.model';
import { ICargo } from 'app/shared/model/cargo.model';
import { ClientStatusType } from 'app/shared/model/enumerations/client-status-type.model';

export interface IClient {
  id?: number;
  memberSince?: Moment;
  status?: ClientStatusType;
  internalNotes?: string;
  uniqueId?: string;
  serviceRequest?: IServiceRequest;
  cargos?: ICargo[];
}

export const defaultValue: Readonly<IClient> = {};
