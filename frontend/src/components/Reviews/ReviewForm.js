import React, { useState, useEffect } from 'react';
import { TextField, Button, Rating, Box, Typography, Alert } from '@mui/material';
import { submitItemReview } from '../../client/api'; // Adjust path as needed
import { isLoggedIn, getUserProfileData, handleLogout as authHandleLogout } from '../../client/auth'; // Added for auth

const SubmitReviewForm = ({ itemId, onItemReviewed }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    console.log('SubmitReviewForm rendered with itemId:', itemId);

    useEffect(() => {
        setIsAuthenticated(isLoggedIn());
    }, []);

    // Auto-clear success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (rating === 0) {
            setError('Пожалуйста, укажите рейтинг.');
            return;
        }
        if (!comment.trim()) {
            setError('Пожалуйста, оставьте комментарий.');
            return;
        }
        if (!isAuthenticated && !guestName.trim()) {
            setError('Пожалуйста, укажите ваше имя.');
            return;
        }
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const reviewData = { comment, rating };
            if (!isAuthenticated) reviewData.guest_name = guestName;

            await submitItemReview(itemId, reviewData);
            setSuccess('Спасибо за отзыв! Ваш отзыв отправлен на модерацию и будет опубликован после проверки.');
            alert('Спасибо за отзыв! Ваш отзыв отправлен на модерацию и будет опубликован после проверки.');
            setComment('');
            setRating(0);
            setGuestName('');
            if (onItemReviewed) {
                onItemReviewed();
            }
        } catch (err) {
            setError(err.message || 'Не удалось отправить отзыв.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 3,
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                backgroundColor: "white",
                color: '#000',
            }}
        >
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Typography variant="h6" gutterBottom>Оставить отзыв</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            
            <Typography component="legend">Рейтинг</Typography>
            <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Комментарий"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            {!isAuthenticated && (
                <TextField
                    label="Ваше имя"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2, backgroundColor: '#fff' }}
                />
            )}
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
            </Button>
        </Box>
    );
};

export default SubmitReviewForm;