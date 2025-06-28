import React from 'react';
import { useOutletContext } from 'react-router';
import ExchangeDetails from '../../components/Exchanges/ExchangeDetails'; // Assuming this component exists
import ExchangeReviews from '../../components/Exchanges/ExchangeReviews'; // Assuming this component exists
import { Typography } from '@mui/material';

const ExchangeDetailsContentPage = () => {
    const { exchange, onRatingClick } = useOutletContext();
    const { reviewFormOpen, reviewFormRating, setReviewFormOpen } = useOutletContext();

    if (!exchange) {
        return <Typography>Exchange data is not available.</Typography>;
    }

return (
    <>
        <ExchangeDetails 
            exchange={exchange} 
            onRatingClick={onRatingClick} // Pass the handler for rating clicks
        />
        <ExchangeReviews
            exchangeId={exchange.id}
            exchangeName={exchange.name}
            showSubmitForm={reviewFormOpen}
            preselectedRating={reviewFormRating}
            onCloseSubmitForm={() => setReviewFormOpen(false)}
        />
    </>
);
};

export default ExchangeDetailsContentPage;
