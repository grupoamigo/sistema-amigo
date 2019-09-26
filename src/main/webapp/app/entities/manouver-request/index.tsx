import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ManouverRequest from './manouver-request';
import ManouverRequestDetail from './manouver-request-detail';
import ManouverRequestUpdate from './manouver-request-update';
import ManouverRequestDeleteDialog from './manouver-request-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ManouverRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ManouverRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ManouverRequestDetail} />
      <ErrorBoundaryRoute path={match.url} component={ManouverRequest} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ManouverRequestDeleteDialog} />
  </>
);

export default Routes;
