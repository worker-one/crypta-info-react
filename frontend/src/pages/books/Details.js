// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/pages/books/Details.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, useLocation, Link as RouterLink } from 'react-router';
import { Container, Tabs, Tab, Box, CircularProgress, Alert, Typography, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { getBookDetails, BASE_API_URL } from '../../client/api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const BookDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewFormRating, setReviewFormRating] = useState(null);

    useEffect(() => {
        if (!slug) {
            setError('Book slug not provided.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        setReviewFormOpen(false);
        setReviewFormRating(null);

        getBookDetails(slug)
            .then(data => {
                setBook(data);
                document.title = `${data.name} - Обзор | Crypta.Info`;
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load book details.');
                setIsLoading(false);
                console.error(err);
            });
    }, [slug]);

    const handleRatingClickAndNavigate = (rating) => {
        setReviewFormOpen(true);
        setReviewFormRating(rating);
        navigate(`/books/${slug}/reviews`);
    };
    
    const getCurrentTabValue = useCallback(() => {
        const path = location.pathname;
        const basePath = `/books/${slug}`;
        if (path === `${basePath}/reviews`) return 'reviews';
        if (path === `${basePath}/buy`) return 'buy';
        if (path === `${basePath}/details` || path === basePath || path === `${basePath}/`) return 'details';
        return 'details';
    }, [location.pathname, slug]);

    const activeTabValue = getCurrentTabValue();

    if (isLoading) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress size={60} /></Container>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
    if (!book) return <Container><Typography sx={{mt:2}}>Книга не найдена.</Typography></Container>;

    const outletContext = { 
        book, 
        reviewFormOpen, 
        preselectedRating: reviewFormRating, 
        setReviewFormOpen,
        onRatingClick: handleRatingClickAndNavigate,
        onCloseSubmitForm: () => setReviewFormOpen(false)
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container sx={{ flex: 1 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
                    <MuiLink component={RouterLink} to='/' sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </MuiLink>
                    <MuiLink component={RouterLink} to='/books' sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        Книги
                    </MuiLink>
                    <Typography color="text.primary">{book.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Tabs value={activeTabValue} aria-label="Book details tabs">
                        <Tab 
                            label="Обзор" 
                            value="details"
                            component={RouterLink} 
                            to={`/books/${slug}/details`} 
                            icon={<InfoIcon />} 
                            iconPosition="start" 
                        />
                        <Tab 
                            label={`Отзывы (${book.total_review_count || 0})`} 
                            value="reviews"
                            component={RouterLink}
                            to={`/books/${slug}/reviews`}
                            icon={<ReviewsIcon />} 
                            iconPosition="start" 
                        />
                        <Tab 
                            label="Где купить" 
                            value="buy"
                            component={RouterLink}
                            to={`/books/${slug}/buy`}
                            icon={<ShoppingCartIcon />} 
                            iconPosition="start" 
                        />
                    </Tabs>
                    {book.purchase_links && book.purchase_links.length > 0 && (
                         <Button 
                            variant="contained" 
                            startIcon={<ShoppingCartIcon />}
                            component={RouterLink}
                            to={`/books/${slug}/buy`}
                            color="secondary"
                            sx={{ ml: 'auto', color: 'white' }}
                        >
                            Купить книгу
                        </Button>
                    )}
                </Box>

                <Box sx={{ pt: 3 }}>
                    <Outlet context={outletContext} />
                </Box>

            </Container>
            <Footer />
        </Box>
    );
};

export default BookDetailsPage;