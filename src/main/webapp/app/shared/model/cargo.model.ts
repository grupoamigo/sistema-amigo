import { IWarehouse } from 'app/shared/model/warehouse.model';
import { ISeal } from 'app/shared/model/seal.model';
import { IClient } from 'app/shared/model/client.model';
import { CargoType } from 'app/shared/model/enumerations/cargo-type.model';
import { CargoStatusType } from 'app/shared/model/enumerations/cargo-status-type.model';

export interface ICargo {
  id?: number;
  type?: CargoType;
  uniqueId?: string;
  description?: string;
  status?: CargoStatusType;
  warehouse?: IWarehouse;
  seals?: ISeal;
  client?: IClient;
  warehouses?: IWarehouse;
}

export const defaultValue: Readonly<ICargo> = {};
