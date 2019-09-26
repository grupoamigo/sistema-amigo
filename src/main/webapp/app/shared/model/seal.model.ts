import { ICargo } from 'app/shared/model/cargo.model';

export interface ISeal {
  id?: number;
  issuer?: string;
  uniqueId?: string;
  cargoSeals?: ICargo[];
}

export const defaultValue: Readonly<ISeal> = {};
