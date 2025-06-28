import { Route } from 'react-router'; // Ensure using react-router

// Assuming ExchangesPage lists all exchanges
// import ExchangesPage from '../pages/exchanges/ExchangesPage'; 

import ExchangeDetailsPage from '../pages/exchanges/Item';
import ExchangesTablePage from '../pages/exchanges/Table'; // Assuming this is the page listing all exchanges
import ExchangeDetailsContentPage from '../pages/exchanges/DetailsContent';
import ExchangeNewsPage from '../pages/exchanges/NewsList';
import ExchangeReviewsPage from '../pages/exchanges/Reviews';
import ExchangeNewsListPage from '../pages/exchanges/NewsContent';
import ExchangeGuidesPage from '../pages/exchanges/Guides';

const exchangeRoutes = (
    <>
        {/* Example: Route for listing all exchanges, if you have one */}
        <Route path="/exchanges" element={<ExchangesTablePage />} /> {/* Assuming you have an ExchangesTablePage component */}
        
        {/* Route for a specific exchange, acting as a layout for tabbed content */}
        <Route path="/exchanges/:slug" element={<ExchangeDetailsPage />} key="exchange-parent">
            <Route index element={<ExchangeDetailsContentPage />} /> {/* Default tab */}
            <Route path="details" element={<ExchangeDetailsContentPage />} />
            <Route path="reviews" element={<ExchangeReviewsPage />} />
            <Route path="news" element={<ExchangeNewsListPage />} />
            <Route path="guides" element={<ExchangeGuidesPage />} />
        </Route>

        <Route path="/exchanges/news/:id" element={<ExchangeNewsPage />} />
    </>
);

export default exchangeRoutes;
