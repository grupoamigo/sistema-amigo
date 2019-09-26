import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Inspection from './inspection';
import InspectionDetail from './inspection-detail';
import InspectionUpdate from './inspection-update';
import InspectionDeleteDialog from './inspection-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={InspectionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={InspectionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={InspectionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Inspection} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={InspectionDeleteDialog} />
  </>
);

export default Routes;
