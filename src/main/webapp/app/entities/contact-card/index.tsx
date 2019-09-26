import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ContactCard from './contact-card';
import ContactCardDetail from './contact-card-detail';
import ContactCardUpdate from './contact-card-update';
import ContactCardDeleteDialog from './contact-card-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ContactCardUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ContactCardUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ContactCardDetail} />
      <ErrorBoundaryRoute path={match.url} component={ContactCard} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ContactCardDeleteDialog} />
  </>
);

export default Routes;
