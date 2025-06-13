import React from 'react';
import { Route } from 'react-router';
import ExchangesTablePage from '../pages/exchanges/ExchangesTablePage';
import ExchangeDetailsPage from '../pages/exchanges/ExchangeDetailsPage';
import ExchangeNewsPage from '../pages/exchanges/ExchangeNewsPage';

const exchangeRoutes = (
  <>
    <Route path="/exchanges" element={<ExchangesTablePage />} />
    <Route path="/exchanges/details/:slug" element={<ExchangeDetailsPage />} />
    <Route path="/exchanges/news/:id" element={<ExchangeNewsPage />} />
  </>
);

export default exchangeRoutes;
