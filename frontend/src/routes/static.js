import React from 'react';
import { Route } from 'react-router';
import { StaticPage } from '../pages/static';

const staticRoutes = (
  <>
    <Route path="/terms" element={<StaticPage />} />
    <Route path="/privacy" element={<StaticPage />} />
    <Route path="/about" element={<StaticPage />} />
    <Route path="/faq" element={<StaticPage />} />
    <Route path="/contact" element={<StaticPage />} />
  </>
);

export default staticRoutes;
