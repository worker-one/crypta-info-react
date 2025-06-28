import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Button, Card, CardContent, CardActions, Box, Container, Typography, Paper, CircularProgress, Alert, List, Divider } from '@mui/material';
import { getUserProfileData } from '../client/auth';
import { listMyItemReviews } from '../client/api'; // Replace with user endpoints

const UserProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Get user profile
                const profile = getUserProfileData();
                if (profile) {
                    setUserProfile(profile);
                } else {
                    setError('User profile not found. Please ensure you are logged in.');
                }

                // 2. Get user's reviews
                const reviewsResponse = await listMyItemReviews({ limit: 50 });
                setUserReviews(reviewsResponse.items || []);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError(err.message || 'Failed to load user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Мой профиль
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Section 1: General info about user account */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Информация</Typography>
                        {userProfile ? (
                            <>
                                <Typography><strong>Имя:</strong> {userProfile.name}</Typography>
                                <Typography><strong>Email:</strong> {userProfile.email}</Typography>
                                <Typography><strong>Роль:</strong> {userProfile.role || "Пользователь"}</Typography>
                            </>
                        ) : (
                            <Typography>Не удалось загрузить профиль пользователя.</Typography>
                        )}
                    </Paper>

                    {/* Section 3: User's reviews */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Мои отзывы ({userReviews.length})</Typography>
                        {userReviews.length > 0 ? (
                            <List>
                                {userReviews.map((review, idx) => (
                                    <Card key={review.id || idx} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="title1">
                                                {review.item.name || 'Unknown Item'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2" color="text.primary">
                                                {review.comment || 'No comment provided.'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Оценка: {review.rating || 'N/A'}
                                            </Typography>
                                            
                                            <Typography variant="caption" color="text.secondary">
                                                Статус: {review.moderation_status || 'Pending'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Typography>You have not submitted any reviews yet.</Typography>
                        )}
                    </Paper>
                </Container>
            </Container>
            <Footer />
        </Box>
    );
};

export default UserProfilePage;
