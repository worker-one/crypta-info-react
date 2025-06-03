// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/ExchangeDetails/ReviewList.js
import React from 'react';
import { isLoggedIn, getUserProfileData, handleLogout as authHandleLogout } from '../../client/auth'; // Added for auth
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Rating, Button, Divider, CircularProgress, Alert } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { voteOnReview } from '../../client/api'; // Adjust path

const ReviewList = ({ reviews, isLoading, error, onVote }) => {
    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!reviews || reviews.length === 0) return <Typography>Отзывов пока нет.</Typography>;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    const authStatus = isLoggedIn();
    setIsAuthenticated(authStatus);
    if (authStatus) {
        const userProfile = getUserProfileData();
        // Assuming userProfile has an 'is_admin' boolean field or similar
        // e.g., userProfile.role === 'admin' or userProfile.roles.includes('admin')
        setIsAdmin(userProfile?.is_admin === true); 
    } else {
        setIsAdmin(false);
    }
    }, []); // Runs on component mount. Re-run if dependencies change or via global state.

    const onLogoutClick = () => {
    authHandleLogout(); // Calls the original logout logic from auth.js
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login'); // Navigate to login page using React Router
    };



    const handleVote = async (reviewId, isUseful) => {
        try {
            if (!isAuthenticated) {
                // Show pop up with login button
                <Card sx={{ p: 2, mb: 2 }}>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Пожалуйста, <Button onClick={() => navigate('/login')}>войдите</Button>, чтобы голосовать за отзывы.
                        </Typography>
                    </CardContent>
                </Card>;
                return;
            }
            await voteOnReview(reviewId, isUseful);
            if (onVote) onVote(reviewId, isUseful); // Notify parent to potentially re-fetch or update UI
        } catch (err) {
            console.error("Failed to vote on review:", err);
            // Optionally show an error to the user
        }
    };

    return (
        <Box>
            {reviews.map((review, index) => (
                <Card key={review.id || index} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">
                                {review.user?.nickname || review.guest_name || 'Аноним'}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ my: 1 }}>{review.comment}</Typography>
                        <Divider sx={{ my: 1 }}/>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">Полезный отзыв?</Typography>
                            <Button size="small" startIcon={<ThumbUpIcon />} onClick={() => handleVote(review.id, true)}>
                                Да ({review.useful_count || 0})
                            </Button>
                            <Button size="small" startIcon={<ThumbDownIcon />} onClick={() => handleVote(review.id, false)}>
                                Нет ({review.not_useful_count || 0})
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ReviewList;