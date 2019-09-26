import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { ICompany } from 'app/shared/model/company.model';
import { MembershipRole } from 'app/shared/model/enumerations/membership-role.model';
import { MembershipLevelType } from 'app/shared/model/enumerations/membership-level-type.model';

export interface IMembership {
  id?: number;
  phone?: string;
  role?: MembershipRole;
  profilePictureContentType?: string;
  profilePicture?: any;
  created?: Moment;
  expires?: Moment;
  accountLevel?: MembershipLevelType;
  verified?: boolean;
  user?: IUser;
  employer?: ICompany;
}

export const defaultValue: Readonly<IMembership> = {
  verified: false
};
