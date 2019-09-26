import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Company from './company';
import Membership from './membership';
import Client from './client';
import Manouver from './manouver';
import ManouverRequest from './manouver-request';
import Cargo from './cargo';
import Seal from './seal';
import ExtraField from './extra-field';
import Location from './location';
import CountryCode from './country-code';
import StateCode from './state-code';
import ContactCard from './contact-card';
import Service from './service';
import ServiceQuote from './service-quote';
import ServiceRequest from './service-request';
import Contract from './contract';
import Inspection from './inspection';
import Evidence from './evidence';
import Damage from './damage';
import Driver from './driver';
import Transport from './transport';
import Warehouse from './warehouse';
import Route from './route';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/company`} component={Company} />
      <ErrorBoundaryRoute path={`${match.url}/membership`} component={Membership} />
      <ErrorBoundaryRoute path={`${match.url}/client`} component={Client} />
      <ErrorBoundaryRoute path={`${match.url}/manouver`} component={Manouver} />
      <ErrorBoundaryRoute path={`${match.url}/manouver-request`} component={ManouverRequest} />
      <ErrorBoundaryRoute path={`${match.url}/cargo`} component={Cargo} />
      <ErrorBoundaryRoute path={`${match.url}/seal`} component={Seal} />
      <ErrorBoundaryRoute path={`${match.url}/extra-field`} component={ExtraField} />
      <ErrorBoundaryRoute path={`${match.url}/location`} component={Location} />
      <ErrorBoundaryRoute path={`${match.url}/country-code`} component={CountryCode} />
      <ErrorBoundaryRoute path={`${match.url}/state-code`} component={StateCode} />
      <ErrorBoundaryRoute path={`${match.url}/contact-card`} component={ContactCard} />
      <ErrorBoundaryRoute path={`${match.url}/service`} component={Service} />
      <ErrorBoundaryRoute path={`${match.url}/service-quote`} component={ServiceQuote} />
      <ErrorBoundaryRoute path={`${match.url}/service-request`} component={ServiceRequest} />
      <ErrorBoundaryRoute path={`${match.url}/contract`} component={Contract} />
      <ErrorBoundaryRoute path={`${match.url}/inspection`} component={Inspection} />
      <ErrorBoundaryRoute path={`${match.url}/evidence`} component={Evidence} />
      <ErrorBoundaryRoute path={`${match.url}/damage`} component={Damage} />
      <ErrorBoundaryRoute path={`${match.url}/driver`} component={Driver} />
      <ErrorBoundaryRoute path={`${match.url}/transport`} component={Transport} />
      <ErrorBoundaryRoute path={`${match.url}/warehouse`} component={Warehouse} />
      <ErrorBoundaryRoute path={`${match.url}/route`} component={Route} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
