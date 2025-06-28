// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/pages/exchanges/ExchangeDetailsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, useLocation, Link as RouterLink } from 'react-router'; // Updated imports
import { Container, Tabs, Tab, Box, CircularProgress, Alert, Typography, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';

// ExchangeDetails component is now in its own page, ExchangeReviews too.
// ExchangeNews component is used in NewsPage.

import { getExchangeDetails, fetchExchangeNews, fetchExchangeGuides, BASE_API_URL } from '../../client/api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

// TabPanel is no longer needed here as content is rendered by child routes via Outlet

const ExchangeDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // For determining active tab

    const [exchange, setExchange] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // activeTab state is now derived from URL, see activeTabValue below
    const [newsCount, setNewsCount] = useState(0);
    const [guidesCount, setGuidesCount] = useState(0);
    const [newsList, setNewsList] = useState([]); // To pass to NewsPage via context

    // State for review form, to be passed via context
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewFormRating, setReviewFormRating] = useState(null);

    const fetchCounts = useCallback(async (exchangeId) => {
        try {
            const newsResponse = await fetchExchangeNews(exchangeId);
            setNewsCount(newsResponse.total > 0 ? newsResponse.total : 0);
            setNewsList(newsResponse.items || []);
        } catch (e) {
            console.warn("Failed to fetch news count", e);
            setNewsCount(0);
            setNewsList([]);
        }
        try {
            const guidesResponse = await fetchExchangeGuides(exchangeId);
            setGuidesCount(guidesResponse.total > 0 ? guidesResponse.total : 0);
        } catch (e) {
            console.warn("Failed to fetch guides count", e);
            setGuidesCount(0);
        }
    }, []);

    useEffect(() => {
        if (!slug) {
            setError('Exchange slug not provided.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        setReviewFormOpen(false); // Reset review form state on slug change
        setReviewFormRating(null);

        getExchangeDetails(slug)
            .then(data => {
                setExchange(data);
                document.title = `${data.name} - Обзор | Crypta.Info`;
                fetchCounts(data.id);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load exchange details.');
                setIsLoading(false);
                console.error(err);
            });
    }, [slug, fetchCounts]);

    // This function is called from ExchangeDetailsContentPage (via context)
    // It sets state for the review form and navigates to the reviews page.
    const handleRatingClickAndNavigate = (rating) => {
        setReviewFormOpen(true);
        setReviewFormRating(rating);
        navigate(`/exchanges/${slug}/reviews`);
    };
    
    const getCurrentTabValue = useCallback(() => {
        const path = location.pathname;
        const basePath = `/exchanges/${slug}`;
        if (path === `${basePath}/reviews`) return 'reviews';
        if (path === `${basePath}/news` && newsCount > 0) return 'news';
        if (path === `${basePath}/guides` && guidesCount > 0) return 'guides';
        if (path === `${basePath}/details` || path === basePath || path === `${basePath}/`) return 'details';
        // Fallback or if counts are not yet loaded, default to details
        return 'details';
    }, [location.pathname, slug, newsCount, guidesCount]);

    const activeTabValue = getCurrentTabValue();

    if (isLoading) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress size={60} /></Container>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
    if (!exchange) return <Container><Typography sx={{mt:2}}>Биржа не найдена.</Typography></Container>;

    const outletContext = { 
        exchange, 
        newsList, 
        reviewFormOpen, 
        preselectedRating: reviewFormRating, 
        setReviewFormOpen,
        onRatingClick: handleRatingClickAndNavigate, // For ExchangeDetailsContentPage
        onCloseSubmitForm: () => setReviewFormOpen(false) // For ReviewsPage
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
                    <MuiLink component={RouterLink} to='/' sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </MuiLink>
                    <MuiLink component={RouterLink} to='/exchanges' sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        Биржи
                    </MuiLink>
                    <Typography color="text.primary">{exchange.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Tabs value={activeTabValue} aria-label="Exchange details tabs">
                        <Tab 
                            label="Обзор" 
                            value="details"
                            component={RouterLink} 
                            to={`/exchanges/${slug}/details`} 
                            icon={<InfoIcon />} 
                            iconPosition="start" 
                        />
                        <Tab 
                            label={`Отзывы (${exchange.total_review_count || 0})`} 
                            value="reviews"
                            component={RouterLink}
                            to={`/exchanges/${slug}/reviews`}
                            icon={<ReviewsIcon />} 
                            iconPosition="start" 
                        />
                        {newsCount > 0 && (
                            <Tab 
                                label={`Новости (${newsCount})`} 
                                value="news"
                                component={RouterLink}
                                to={`/exchanges/${slug}/news`}
                                icon={<ArticleIcon />} 
                                iconPosition="start" 
                            />
                        )}
                        {guidesCount > 0 && (
                            <Tab 
                                label={`Инструкции (${guidesCount})`} 
                                value="guides"
                                component={RouterLink}
                                to={`/exchanges/${slug}/guides`}
                                icon={<MenuBookIcon />} 
                                iconPosition="start" 
                            />
                        )}
                    </Tabs>
                    {exchange.website_url && (
                         <Button 
                            variant="contained" 
                            startIcon={<LanguageIcon />}
                            href={`${BASE_API_URL}/exchanges/go/${exchange.slug}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            color="secondary"
                            sx={{ ml: 'auto', color: 'white' }}
                        >
                            Официальный сайт
                        </Button>
                    )}
                </Box>

                {/* Render child route's content here */}
                <Box sx={{ pt: 3 }}>
                    <Outlet context={outletContext} />
                </Box>

            </Container>
            <Footer />
        </Box>
    );
};

export default ExchangeDetailsPage;