import React from 'react';
import { Route } from 'react-router';
import BooksTablePage from '../pages/books/Table';
import BookDetailsPage from '../pages/books/Details';
import BookDetailsContent from '../pages/books/DetailsContent';
import BookReviewsPage from '../pages/books/Reviews';
import BookBuyPage from '../pages/books/Buy';

const bookRoutes = (
    <>
        {/* Example: Route for listing all books */}
        <Route path="/books" element={<BooksTablePage />} />

        {/* Route for a specific book, acting as a layout for tabbed content */}
        <Route path="/books/:slug" element={<BookDetailsPage />} key="book-parent">
            <Route index element={<BookDetailsContent />} /> {/* Default tab */}
            <Route path="details" element={<BookDetailsContent />} />
            <Route path="reviews" element={<BookReviewsPage />} />
            <Route path="buy" element={<BookBuyPage />} />
        </Route>

        <Route path="/books/news/:slug" element={<BookDetailsPage />} />
    </>
);

export default bookRoutes;
