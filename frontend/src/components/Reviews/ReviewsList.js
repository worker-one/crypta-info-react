// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/ExchangeDetails/ReviewList.js
import React from 'react';
import { isLoggedIn, getUserProfileData, handleLogout as authHandleLogout } from '../../client/auth'; // Added for auth
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Corrected import path
import { Box, Card, CardContent, Typography, Rating, Button, Divider, CircularProgress, Alert, Modal, Paper } from '@mui/material'; // Added Modal, Paper
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { voteOnReview } from '../../client/api'; // Adjust path

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
};

const ReviewList = ({ reviews, isLoading, error, onVote }) => {
    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!reviews || reviews.length === 0) return <Typography> </Typography>;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [userVotes, setUserVotes] = useState({}); // Added: State for user votes
    const navigate = useNavigate();

    useEffect(() => {
        const authStatus = isLoggedIn();
        setIsAuthenticated(authStatus);
        if (authStatus) {
            const userProfile = getUserProfileData();
            setIsAdmin(userProfile?.is_admin === true);
        } else {
            setIsAdmin(false);
        }
    }, []); // Runs on component mount for initial auth status

    useEffect(() => {
        if (isAuthenticated) {
            const userProfile = getUserProfileData();
            // Ensure userProfile and a unique ID (e.g., userProfile.id) are available
            // Adjust 'userProfile.id' if your user object uses a different key for the unique ID
            const userId = userProfile?.id || userProfile?.sub; // Use 'id' or 'sub' as common unique identifiers
            if (userId) {
                const storedVotes = localStorage.getItem(`userVotes_${userId}`);
                if (storedVotes) {
                    try {
                        setUserVotes(JSON.parse(storedVotes));
                    } catch (e) {
                        console.error("Failed to parse stored votes:", e);
                        localStorage.removeItem(`userVotes_${userId}`); // Clear corrupted data
                        setUserVotes({});
                    }
                } else {
                    setUserVotes({}); // Initialize if no votes are stored
                }
            }
        } else {
            setUserVotes({}); // Clear votes if user is not authenticated
        }
    }, [isAuthenticated]); // Re-run when isAuthenticated changes

    const onLogoutClick = () => {
        authHandleLogout(); // Calls the original logout logic from auth.js
        setIsAuthenticated(false);
        setIsAdmin(false);
        setShowLoginPrompt(false); // Hide prompt on logout
        navigate('/login'); // Navigate to login page using React Router
    };

    const handleVote = async (reviewId, isUseful) => {
        console.log("Handling vote for review:", reviewId, "isUseful:", isUseful);
        if (!isAuthenticated) {
            console.log("User is not authenticated");
            setShowLoginPrompt(true);
            return;
        }

        const userProfile = getUserProfileData();
        const userId = userProfile?.id || userProfile?.sub; // Consistent unique ID usage

        if (!userId) {
            console.error("User ID not found, cannot track vote.");
            // Optionally, inform the user that their vote cannot be saved without a user ID.
            alert("Не удалось определить пользователя. Ваш голос не будет сохранен.");
            return;
        }

        if (userVotes[reviewId] !== undefined) {
            alert("Вы уже голосовали за этот отзыв.");
            return;
        }
        
        console.log("User is authenticated, proceeding with vote");
        try {
            await voteOnReview(reviewId, isUseful);
            
            const updatedVotes = { ...userVotes, [reviewId]: isUseful };
            setUserVotes(updatedVotes);
            localStorage.setItem(`userVotes_${userId}`, JSON.stringify(updatedVotes));

            if (onVote) onVote(reviewId, isUseful);

            // Optimistically update the review counts
            reviews = reviews.map(review => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        useful_votes_count: isUseful ? (review.useful_votes_count || 0) + 1 : review.useful_votes_count,
                        not_useful_votes_count: !isUseful ? (review.not_useful_votes_count || 0) + 1 : review.not_useful_votes_count,
                    };
                }
                return review;
            }
            );
        } catch (err) {
            console.error("Failed to vote on review:", err);
            // Optionally show an error to the user
        }
    };

    const handleCloseLoginPrompt = () => {
        setShowLoginPrompt(false);
    };

    return (
        <Box>
            <Modal
                open={showLoginPrompt}
                onClose={handleCloseLoginPrompt}
                aria-labelledby="login-prompt-title"
                aria-describedby="login-prompt-description"
            >
                <Paper sx={modalStyle}>
                    <Typography id="login-prompt-title" variant="h6" component="h2">
                        Требуется вход
                    </Typography>
                    <Typography id="login-prompt-description" sx={{ mt: 2 }}>
                        Пожалуйста, войдите, чтобы голосовать за отзывы.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <Button variant="outlined" onClick={handleCloseLoginPrompt}>
                            Закрыть
                        </Button>
                        <Button variant="contained" onClick={() => {
                            handleCloseLoginPrompt();
                            navigate('/login');
                        }}>
                            Войти
                        </Button>
                    </Box>
                </Paper>
            </Modal>
            {reviews.map((review, index) => {
                const hasVotedOnThisReview = userVotes[review.id] !== undefined;

                return (
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
                                <Button 
                                    size="small" 
                                    startIcon={<ThumbUpIcon />} 
                                    onClick={() => handleVote(review.id, true)}
                                    disabled={hasVotedOnThisReview} // Disable if already voted
                                >
                                    Да ({review.useful_votes_count || 0})
                                </Button>
                                <Button 
                                    size="small" 
                                    startIcon={<ThumbDownIcon />} 
                                    onClick={() => handleVote(review.id, false)}
                                    disabled={hasVotedOnThisReview} // Disable if already voted
                                >
                                    Нет ({review.not_useful_votes_count || 0})
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default ReviewList;