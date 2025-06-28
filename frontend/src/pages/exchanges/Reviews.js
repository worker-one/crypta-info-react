import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router';
import ExchangeReviews from '../../components/Exchanges/ExchangeReviews'; // Assuming this component exists
import { Typography } from '@mui/material';

const ExchangeReviewsPage = () => {
    const { slug } = useParams(); // Needed if ExchangeReviews needs it, or for fetching reviews specifically for this page
    const { 
        exchange, 
        reviewFormOpen, 
        preselectedRating, 
        setReviewFormOpen, // To potentially open form via other means if needed
        onCloseSubmitForm  // To close the form
    } = useOutletContext();

    useEffect(() => {
        if (exchange) {
             document.title = `${exchange.name} - Отзывы | Crypta.Info`;
        }
    }, [exchange]);

    if (!exchange) {
        return <Typography>Exchange data is not available.</Typography>;
    }
    
    // The reviewFormOpen and preselectedRating are controlled by ExchangeDetailsPage (parent)
    // and passed via context. When a rating is clicked on the details page,
    // ExchangeDetailsPage sets these states and navigates here.

    return (
        <ExchangeReviews
            exchangeId={exchange.id}
            exchangeName={exchange.name}
            exchangeSlug={slug} // Pass slug if needed by ExchangeReviews
            showSubmitForm={reviewFormOpen}
            preselectedRating={preselectedRating}
            onCloseSubmitForm={onCloseSubmitForm}
        />
    );
};

export default ExchangeReviewsPage;
