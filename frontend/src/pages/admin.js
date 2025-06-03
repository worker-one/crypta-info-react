import { useState, useEffect } from 'react';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import { Box, Container, Typography, Paper, CircularProgress, Alert, List } from '@mui/material';
import { getUserProfileData } from '../client/auth'; // Assuming this gets the locally stored profile
import { adminListExchanges, listBooks, adminListPendingReviews, adminModerateReview } from '../client/api';
import ReviewPending from '../components/Reviews/ReviewPending'; // Adjust path as necessary

const AdminPage = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moderationError, setModerationError] = useState('');
  const [moderationSuccess, setModerationSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Get admin profile
        const profile = getUserProfileData();
        if (profile) {
          setAdminProfile(profile);
        } else {
          // Optionally, try to fetch it if not available, or redirect if not admin
          // For now, we assume it's available if the user can reach this page.
          setError('Admin profile not found. Please ensure you are logged in as an admin.');
        }

        // 2. Get exchange count
        // We fetch with limit 1 just to get the total count from the response metadata
        const exchangesResponse = await adminListExchanges({ limit: 1 });
        setExchangeCount(exchangesResponse.total || 0);

        // 3. Get book count
        const booksResponse = await listBooks({ limit: 1 });
        setBookCount(booksResponse.total || 0);

        // 4. Get reviews for moderation
        const reviewsResponse = await adminListPendingReviews({ limit: 50 }); // Fetch up to 50 pending reviews
        setPendingReviews(reviewsResponse.items || []);

      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        setError(err.message || 'Failed to load admin data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    }, []);

    const handleModerateReview = async (reviewId, status) => {
        setModerationError('');
        setModerationSuccess('');
        try {
            await adminModerateReview(reviewId, { moderation_status: status });
            setPendingReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
            setModerationSuccess(`Review ID ${reviewId} has been ${status}.`);
        } catch (err) {
            console.error(`Failed to ${status} review:`, err);
            setModerationError(err.message || `Failed to ${status} review ID ${reviewId}. Please try again.`);
        }
    };

    const handleApproveReview = (reviewId) => {
        handleModerateReview(reviewId, 'approved');
    };

    const handleRejectReview = (reviewId) => {
        handleModerateReview(reviewId, 'rejected');
    };

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
                        Admin Dashboard
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {moderationError && <Alert severity="error" sx={{ mb: 2 }}>{moderationError}</Alert>}
                    {moderationSuccess && <Alert severity="success" sx={{ mb: 2 }}>{moderationSuccess}</Alert>}

                    {/* Section 1: General info about admin account */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Admin Information</Typography>
                        {adminProfile ? (
                            <>
                                <Typography><strong>Nickname:</strong> {adminProfile.nickname}</Typography>
                                <Typography><strong>Email:</strong> {adminProfile.email}</Typography>
                                <Typography><strong>Role:</strong> {adminProfile.role}</Typography>
                            </>
                        ) : (
                            <Typography>Could not load admin profile.</Typography>
                        )}
                    </Paper>

                    {/* Section 2: Count for items */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Content Overview</Typography>
                        <Typography><strong>Total Exchanges:</strong> {exchangeCount}</Typography>
                        <Typography><strong>Total Books:</strong> {bookCount}</Typography>
                    </Paper>

                    {/* Section 3: Reviews for moderation */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Reviews for Moderation ({pendingReviews.length})</Typography>
                        {pendingReviews.length > 0 ? (
                            <List>
                                {pendingReviews.map((review, idx) => (
                                    <ReviewPending
                                        key={review.id || idx}
                                        review={review}
                                        onApprove={handleApproveReview}
                                        onReject={handleRejectReview}
                                    />
                                ))}
                            </List>
                        ) : (
                            <Typography>No reviews currently pending moderation.</Typography>
                        )}
                    </Paper>
                </Container>
            </Container>
            <Footer />
        </Box>
    );
    };

export default AdminPage;
