import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ExtraField from './extra-field';
import ExtraFieldDetail from './extra-field-detail';
import ExtraFieldUpdate from './extra-field-update';
import ExtraFieldDeleteDialog from './extra-field-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ExtraFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ExtraFieldUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ExtraFieldDetail} />
      <ErrorBoundaryRoute path={match.url} component={ExtraField} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ExtraFieldDeleteDialog} />
  </>
);

export default Routes;
