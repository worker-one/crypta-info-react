import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, ButtonGroup, CircularProgress, Alert } from '@mui/material';
import ReviewsList from './ReviewsList'; // Adjusted path
import ReviewForm from './ReviewForm'; // Adjusted path
import { listItemReviews } from '../../client/api'; // Path should be correct if it was correct before

const ReviewsSection = ({ itemId, itemName, preselectedRating }) => {
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'positive', 'negative'

    const fetchReviews = useCallback(async () => {
        if (!itemId) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await listItemReviews(itemId, { limit: 100, sort_by: 'created_at', direction: 'desc' });
            const fetchedReviews = response.items.filter(review => review.comment !== null);
            console.log('Fetched reviews:', fetchedReviews); // Debugging log
            setAllReviews(fetchedReviews);
            setReviews(fetchedReviews);
        } catch (err) {
            setError(err.message || 'Не удалось загрузить отзывы.');
            setAllReviews([]);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [itemId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        if (preselectedRating && preselectedRating > 0) {
            setShowSubmitForm(true);
        }
    }, [preselectedRating]);

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
        // Note: preselectedRating is not reset here, BookDetailsPage handles it on tab change.
    };
    
    const handleVote = (reviewId, isUseful) => {
        setAllReviews(prevReviews => prevReviews.map(r => {
            if (r.id === reviewId) {
                return {
                    ...r,
                    useful_count: isUseful ? (r.useful_count || 0) + 1 : r.useful_count,
                    not_useful_count: !isUseful ? (r.not_useful_count || 0) + 1 : r.not_useful_count,
                };
            }
            return r;
        }));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Отзывы о {itemName}</Typography>
                <Button variant="contained" onClick={() => setShowSubmitForm(!showSubmitForm)}>
                    {showSubmitForm ? 'Отменить' : 'Оставить отзыв'}
                </Button>
            </Box>
            

            {showSubmitForm && (
                <ReviewForm itemId={itemId} onItemReviewed={handleReviewSubmitted} preselectedRating={preselectedRating} />
            )}

            {allReviews && allReviews.length > 0 && (
                <Box sx={{ my: 2 }}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button onClick={() => setSortBy('date')} disabled={sortBy === 'date'}>новые</Button>
                        <Button color="success" onClick={() => setSortBy('positive')} disabled={sortBy === 'positive'}>хорошие</Button>
                        <Button color="error" onClick={() => setSortBy('negative')} disabled={sortBy === 'negative'}>плохие</Button>
                    </ButtonGroup>
                </Box>
            )}

            {isLoading && <CircularProgress />}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {!isLoading && !error && (
                <ReviewsList reviews={reviews} isLoading={false} error={null} onVote={handleVote} />
            )}
        </Box>
    );
};

export default ReviewsSection;
