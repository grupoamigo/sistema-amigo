import { IUser } from 'app/shared/model/user.model';

export interface IDriver {
  id?: number;
  officialIdContentType?: string;
  officialId?: any;
  firstName?: string;
  lastName?: string;
  pictureContentType?: string;
  picture?: any;
  user?: IUser;
}

export const defaultValue: Readonly<IDriver> = {};
