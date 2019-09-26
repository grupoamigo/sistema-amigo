import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import company, {
  CompanyState
} from 'app/entities/company/company.reducer';
// prettier-ignore
import membership, {
  MembershipState
} from 'app/entities/membership/membership.reducer';
// prettier-ignore
import client, {
  ClientState
} from 'app/entities/client/client.reducer';
// prettier-ignore
import manouver, {
  ManouverState
} from 'app/entities/manouver/manouver.reducer';
// prettier-ignore
import manouverRequest, {
  ManouverRequestState
} from 'app/entities/manouver-request/manouver-request.reducer';
// prettier-ignore
import cargo, {
  CargoState
} from 'app/entities/cargo/cargo.reducer';
// prettier-ignore
import seal, {
  SealState
} from 'app/entities/seal/seal.reducer';
// prettier-ignore
import extraField, {
  ExtraFieldState
} from 'app/entities/extra-field/extra-field.reducer';
// prettier-ignore
import location, {
  LocationState
} from 'app/entities/location/location.reducer';
// prettier-ignore
import countryCode, {
  CountryCodeState
} from 'app/entities/country-code/country-code.reducer';
// prettier-ignore
import stateCode, {
  StateCodeState
} from 'app/entities/state-code/state-code.reducer';
// prettier-ignore
import contactCard, {
  ContactCardState
} from 'app/entities/contact-card/contact-card.reducer';
// prettier-ignore
import service, {
  ServiceState
} from 'app/entities/service/service.reducer';
// prettier-ignore
import serviceQuote, {
  ServiceQuoteState
} from 'app/entities/service-quote/service-quote.reducer';
// prettier-ignore
import serviceRequest, {
  ServiceRequestState
} from 'app/entities/service-request/service-request.reducer';
// prettier-ignore
import contract, {
  ContractState
} from 'app/entities/contract/contract.reducer';
// prettier-ignore
import inspection, {
  InspectionState
} from 'app/entities/inspection/inspection.reducer';
// prettier-ignore
import evidence, {
  EvidenceState
} from 'app/entities/evidence/evidence.reducer';
// prettier-ignore
import damage, {
  DamageState
} from 'app/entities/damage/damage.reducer';
// prettier-ignore
import driver, {
  DriverState
} from 'app/entities/driver/driver.reducer';
// prettier-ignore
import transport, {
  TransportState
} from 'app/entities/transport/transport.reducer';
// prettier-ignore
import warehouse, {
  WarehouseState
} from 'app/entities/warehouse/warehouse.reducer';
// prettier-ignore
import route, {
  RouteState
} from 'app/entities/route/route.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly company: CompanyState;
  readonly membership: MembershipState;
  readonly client: ClientState;
  readonly manouver: ManouverState;
  readonly manouverRequest: ManouverRequestState;
  readonly cargo: CargoState;
  readonly seal: SealState;
  readonly extraField: ExtraFieldState;
  readonly location: LocationState;
  readonly countryCode: CountryCodeState;
  readonly stateCode: StateCodeState;
  readonly contactCard: ContactCardState;
  readonly service: ServiceState;
  readonly serviceQuote: ServiceQuoteState;
  readonly serviceRequest: ServiceRequestState;
  readonly contract: ContractState;
  readonly inspection: InspectionState;
  readonly evidence: EvidenceState;
  readonly damage: DamageState;
  readonly driver: DriverState;
  readonly transport: TransportState;
  readonly warehouse: WarehouseState;
  readonly route: RouteState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  company,
  membership,
  client,
  manouver,
  manouverRequest,
  cargo,
  seal,
  extraField,
  location,
  countryCode,
  stateCode,
  contactCard,
  service,
  serviceQuote,
  serviceRequest,
  contract,
  inspection,
  evidence,
  damage,
  driver,
  transport,
  warehouse,
  route,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
