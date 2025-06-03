import React from 'react';
import { Route } from 'react-router';
import BooksTablePage from '../pages/books/BooksTablePage';
import BookDetailsPage from '../pages/books/BookDetailsPage';

const bookRoutes = (
  <>
    <Route path="/books" element={<BooksTablePage />} />
    <Route path="/books/details/:id" element={<BookDetailsPage />} />
  </>
);

export default bookRoutes;
