// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/ExchangeDetails/ExchangeReviews.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, ButtonGroup, CircularProgress, Alert } from '@mui/material';
import ReviewsList from '../Reviews/ReviewsList';
import ReviewForm from '../Reviews/ReviewForm';
import { listItemReviews } from '../../client/api'; // Adjust path

const ExchangeReviews = ({ exchangeId, exchangeName }) => {
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]); // To store all fetched reviews for client-side sort
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'positive', 'negative'

    const fetchReviews = useCallback(async () => {
        if (!exchangeId) return;
        setIsLoading(true);
        setError('');
        try {
            // Fetch a larger limit if sorting client-side, or implement server-side sorting/filtering
            const response = await listItemReviews(exchangeId, { limit: 100, sort_by: 'created_at', direction: 'desc' });
            const fetchedReviews = response.items.filter(review => review.comment !== null);
            setAllReviews(fetchedReviews);
            setReviews(fetchedReviews); // Initially, show all (sorted by date from API)
        } catch (err) {
            setError(err.message || 'Не удалось загрузить отзывы.');
            setAllReviews([]);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [exchangeId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        let sortedReviews = [...allReviews];
        if (sortBy === 'positive') {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'negative') {
            sortedReviews.sort((a, b) => a.rating - b.rating);
        } else { // 'date' or default
            sortedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        setReviews(sortedReviews);
    }, [sortBy, allReviews]);

    const handleReviewSubmitted = () => {
        setShowSubmitForm(false);
        fetchReviews(); // Refresh reviews list
    };
    
    const handleVote = (reviewId, isUseful) => {
        // Optimistically update UI or refetch reviews
        setAllReviews(prevReviews => prevReviews.map(r => {
            if (r.id === reviewId) {
                return {
                    ...r,
                    useful_count: isUseful ? (r.useful_count || 0) + 1 : r.useful_count,
                    not_useful_count: !isUseful ? (r.not_useful_count || 0) + 1 : r.not_useful_count,
                    // Note: This is a simple optimistic update. Real voting might change these counts on the backend.
                };
            }
            return r;
        }));
    };


    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Отзывы о {exchangeName}</Typography>
                <Button color="secondary" variant="contained" onClick={() => setShowSubmitForm(!showSubmitForm)}>
                    {showSubmitForm ? 'Отменить' : 'Оставить отзыв'}
                </Button>
            </Box>

            {showSubmitForm && (
                <ReviewForm itemId={exchangeId} onItemReviewed={handleReviewSubmitted} />
            )}

            <Box sx={{ my: 2 }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => setSortBy('date')} disabled={sortBy === 'date'}>Сначала новые</Button>
                    <Button color="sucess" onClick={() => setSortBy('positive')} disabled={sortBy === 'positive'}>Сначала хорошие</Button>
                    <Button color="error" onClick={() => setSortBy('negative')} disabled={sortBy === 'negative'}>Сначала плохие</Button>
                </ButtonGroup>
            </Box>

            {isLoading && <CircularProgress />}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {!isLoading && !error && (
                <ReviewsList reviews={reviews} isLoading={false} error={null} onVote={handleVote} />
            )}
        </Box>
    );
};

export default ExchangeReviews;