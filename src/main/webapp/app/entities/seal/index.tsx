import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Seal from './seal';
import SealDetail from './seal-detail';
import SealUpdate from './seal-update';
import SealDeleteDialog from './seal-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SealUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SealUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SealDetail} />
      <ErrorBoundaryRoute path={match.url} component={Seal} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={SealDeleteDialog} />
  </>
);

export default Routes;
