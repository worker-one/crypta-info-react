// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/Books/BookDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Avatar, 
    Rating, 
    Button, 
    Chip,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { getBookDetails, listItemReviews } from '../../client/api';
import ReviewsList from '../Reviews/ReviewsList';


const BookDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const bookId = id || searchParams.get('id');

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reviewsError, setReviewsError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        if (bookId) {
            loadBookDetails();
        } else {
            setError('No book identifier provided.');
            setLoading(false);
        }
    }, [bookId]);

    useEffect(() => {
        if (book?.id && activeTab === 1) {
            loadReviews();
        }
    }, [book?.id, activeTab, sortBy, sortDirection]);

    const loadBookDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const bookData = await getBookDetails(bookId);
            setBook(bookData);
            
            // Update page title
            if (bookData?.name) {
                document.title = `${bookData.name} - Crypta.Info`;
            }
        } catch (err) {
            console.error('Error fetching book details:', err);
            setError(err.message || 'Failed to load book details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSortChange = (newSortBy, newDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newDirection);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!book) return null;

    const renderBookOverview = () => (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Grid container columns={5} alignItems="flex-start" sx={{ mb: 3 }}>
                {/* Book Cover Column */}
                <Grid item xs={12} md={4} size={2}>
                    <Box display="flex" justifyContent="center">
                        <Avatar
                            src={book.logo_url || '../assets/images/book-cover-placeholder.png'}
                            alt={`${book.name} Cover`}
                            variant="rounded"
                            sx={{ width: 200, height: 280 }}
                        />
                    </Box>
                </Grid>

                {/* Book Info Column */}
                <Grid item xs={12} md={8} size={3}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* Title */}
                        <Typography variant="h4" gutterBottom>
                            {book.name}
                        </Typography>

                        {/* Stats in a row */}
                        <Grid container spacing={8} alignItems="center">
                            <Grid item xs={6} sm={3}>
                                <Box>
                                    <Rating 
                                        value={parseFloat(book.overall_average_rating) || 0} 
                                        precision={0.1} 
                                        readOnly 
                                    />
                                    <Typography variant="subtitle2" color="text.secondary" align='center'>
                                        {book.total_rating_count || 0} отзывов
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="h6">{book.year || 'N/A'}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" align='center'>
                                    Издание
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="h6">{book.pages || 'N/A'}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" align='center'>
                                    Страниц
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Topics */}
                        {book.topics && book.topics.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Тематика:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {book.topics.map((topic, index) => (
                                        <Chip
                                            key={index}
                                            label={topic.name}
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Description */}
                        {book.overview && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Описание
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    dangerouslySetInnerHTML={{ __html: book.overview }} 
                                />
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );

    return (
        <Box >
            {renderBookOverview()}
        </Box>
    );
};

export default BookDetails;