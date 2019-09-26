import { Moment } from 'moment';

export interface IDamage {
  id?: number;
  reportDate?: Moment;
  description?: string;
}

export const defaultValue: Readonly<IDamage> = {};
