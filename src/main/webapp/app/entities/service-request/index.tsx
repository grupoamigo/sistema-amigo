import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ServiceRequest from './service-request';
import ServiceRequestDetail from './service-request-detail';
import ServiceRequestUpdate from './service-request-update';
import ServiceRequestDeleteDialog from './service-request-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ServiceRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ServiceRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ServiceRequestDetail} />
      <ErrorBoundaryRoute path={match.url} component={ServiceRequest} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ServiceRequestDeleteDialog} />
  </>
);

export default Routes;
