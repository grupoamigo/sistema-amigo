import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Manouver from './manouver';
import ManouverDetail from './manouver-detail';
import ManouverUpdate from './manouver-update';
import ManouverDeleteDialog from './manouver-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ManouverUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ManouverUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ManouverDetail} />
      <ErrorBoundaryRoute path={match.url} component={Manouver} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ManouverDeleteDialog} />
  </>
);

export default Routes;
