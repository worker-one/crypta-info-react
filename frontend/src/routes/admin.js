import React from 'react';
import { Route } from 'react-router';
import AdminPage from '../pages/admin';

const adminRoutes = (
  <>
    <Route path="/admin" element={<AdminPage />} />
  </>
);

export default adminRoutes;
