import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ServiceQuote from './service-quote';
import ServiceQuoteDetail from './service-quote-detail';
import ServiceQuoteUpdate from './service-quote-update';
import ServiceQuoteDeleteDialog from './service-quote-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ServiceQuoteUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ServiceQuoteUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ServiceQuoteDetail} />
      <ErrorBoundaryRoute path={match.url} component={ServiceQuote} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ServiceQuoteDeleteDialog} />
  </>
);

export default Routes;
