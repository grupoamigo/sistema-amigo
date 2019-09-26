import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import StateCode from './state-code';
import StateCodeDetail from './state-code-detail';
import StateCodeUpdate from './state-code-update';
import StateCodeDeleteDialog from './state-code-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={StateCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={StateCodeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={StateCodeDetail} />
      <ErrorBoundaryRoute path={match.url} component={StateCode} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={StateCodeDeleteDialog} />
  </>
);

export default Routes;
