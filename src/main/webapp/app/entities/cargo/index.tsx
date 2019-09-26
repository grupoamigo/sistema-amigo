import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Cargo from './cargo';
import CargoDetail from './cargo-detail';
import CargoUpdate from './cargo-update';
import CargoDeleteDialog from './cargo-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CargoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CargoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CargoDetail} />
      <ErrorBoundaryRoute path={match.url} component={Cargo} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CargoDeleteDialog} />
  </>
);

export default Routes;
