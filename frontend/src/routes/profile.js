import React from 'react';
import { Route } from 'react-router';
import UserProfilePage from '../pages/profile';

const profileRoutes = (
  <>
    <Route path="/profile" element={<UserProfilePage />} />
  </>
);

export default profileRoutes;
