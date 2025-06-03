import React from 'react';
import { Route } from 'react-router';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';

const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </>
);

export default authRoutes;
