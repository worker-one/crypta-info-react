import React from 'react';
import { Route } from 'react-router';
import ExchangesTablePage from '../pages/exchanges/ExchangesTablePage';
import ExchangeDetailsPage from '../pages/exchanges/ExchangeDetailsPage';

const exchangeRoutes = (
  <>
    <Route path="/exchanges" element={<ExchangesTablePage />} />
    <Route path="/exchanges/details/:slug" element={<ExchangeDetailsPage />} />
  </>
);

export default exchangeRoutes;
