import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CountryCode from './country-code';
import CountryCodeDetail from './country-code-detail';
import CountryCodeUpdate from './country-code-update';
import CountryCodeDeleteDialog from './country-code-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CountryCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CountryCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CountryCodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={CountryCode} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CountryCodeDeleteDialog} />
  </>
);

export default Routes;
