// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/Books/BookDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Avatar, 
    Rating, 
    Chip,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import { getBookDetails } from '../../client/api';
import { Container } from '@mui/system';


const BookDetails = ({ book: bookFromProps, onRatingSelect }) => {
    const { id: idFromParams } = useParams();

    const [internalBook, setInternalBook] = useState(null);
    const [loading, setLoading] = useState(!bookFromProps); // Initialize loading based on prop
    const [error, setError] = useState(null);

    const book = bookFromProps || internalBook; // Prioritize prop

    useEffect(() => {
        if (bookFromProps) {
            // If bookFromProps is provided, use it.
            setLoading(false);
            return; 
        }

        // Fetch only if bookFromProps is not available and idFromParams exists
        if (idFromParams) {
            const fetchBookDetails = async () => { // Renamed to avoid potential scope issues
                try {
                    setLoading(true);
                    setError(null);
                    const bookData = await getBookDetails(idFromParams);
                    setInternalBook(bookData);
                } catch (err) {
                    console.error('Error fetching book details:', err);
                    setError(err.message || 'Failed to load book details. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchBookDetails();
        } else if (!bookFromProps) { // Ensure error is set if no id and no prop
            setError('No book identifier provided.');
            setLoading(false);
        }
    }, [idFromParams, bookFromProps]);

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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
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
                                        name="book-rating-interactive" // Added name for accessibility
                                        value={parseFloat(book.overall_average_rating) || 0} 
                                        precision={0.5} // Changed precision for selection
                                        onChange={(event, newValue) => {
                                            if (newValue !== null && onRatingSelect) {
                                                onRatingSelect(newValue);
                                            }
                                        }}
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

                        {/* Tags */}
                        {book.tags && book.tags.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Теги:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {book.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag.name}
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
        {/* Description */}
            {book.overview && (
                <Box sx={{ mt: 3, p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Описание
                    </Typography>
                    <Typography 
                        variant="body1" 
                        dangerouslySetInnerHTML={{ __html: book.overview }} 
                    />
                </Box>
            )}
        </Container>
    );

    return (
        <Box >
            {renderBookOverview()}
        </Box>
    );
};

export default BookDetails;