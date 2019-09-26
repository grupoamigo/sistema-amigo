import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Damage from './damage';
import DamageDetail from './damage-detail';
import DamageUpdate from './damage-update';
import DamageDeleteDialog from './damage-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DamageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DamageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DamageDetail} />
      <ErrorBoundaryRoute path={match.url} component={Damage} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={DamageDeleteDialog} />
  </>
);

export default Routes;
