// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/pages/exchanges/ExchangeDetailsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router'; // Assuming react-router v6
import { Container, Tabs, Tab, Box, CircularProgress, Alert, Typography, Breadcrumbs, Link as MuiLink, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // For breadcrumbs
import InfoIcon from '@mui/icons-material/Info';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';

import ExchangeDetails from '../../components/Exchanges/ExchangeDetails';
import ExchangeReviews from '../../components/Exchanges/ExchangeReviews';
import ExchangeNews from '../../components/Exchanges/ExchangeNews'; // Placeholder for news component

import { getExchangeDetails, fetchExchangeNews, fetchExchangeGuides, BASE_API_URL } from '../../client/api'; // Adjust path
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`exchange-tabpanel-${index}`}
            aria-labelledby={`exchange-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ExchangeDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [exchange, setExchange] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [newsCount, setNewsCount] = useState(0);
    const [guidesCount, setGuidesCount] = useState(0);
    const [newsList, setNewsList] = useState([]);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewFormRating, setReviewFormRating] = useState(null);

    const fetchCounts = useCallback(async (exchangeId) => {
        try {
            const newsResponse = await fetchExchangeNews(exchangeId);
            setNewsCount(newsResponse.total > 0 ? newsResponse.total : 0); // Assuming 'total' is in response
            setNewsList(newsResponse.items || []);
        } catch (e) {
            console.warn("Failed to fetch news count", e);
            setNewsCount(0);
            setNewsList([]);
        }
        try {
            const guidesResponse = await fetchExchangeGuides(exchangeId);
            setGuidesCount(guidesResponse.total > 0 ? guidesResponse.total : 0); // Assuming 'total' is in response
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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleRatingClick = (rating) => {
        setActiveTab(1); // Switch to "Отзывы" tab
        setReviewFormOpen(true);
        setReviewFormRating(rating);
    };

    if (isLoading) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress size={60} /></Container>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
    if (!exchange) return <Container><Typography sx={{mt:2}}>Биржа не найдена.</Typography></Container>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container >
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
                    <MuiLink component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </MuiLink>
                    <MuiLink component="button" onClick={() => navigate('/exchanges')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        Биржи
                    </MuiLink>
                    <Typography color="text.primary">{exchange.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="Exchange details tabs">
                        <Tab label="Обзор" icon={<InfoIcon />} iconPosition="start" id="exchange-tab-0" aria-controls="exchange-tabpanel-0" />
                        <Tab label={`Отзывы (${exchange.total_review_count || 0})`} icon={<ReviewsIcon />} iconPosition="start" id="exchange-tab-1" aria-controls="exchange-tabpanel-1" />
                        {newsCount > 0 && (
                            <Tab label={`Новости (${newsCount})`} icon={<ArticleIcon />} iconPosition="start" id="exchange-tab-2" aria-controls="exchange-tabpanel-2" />
                        )}
                        {guidesCount > 0 && (
                            <Tab label={`Инструкции (${guidesCount})`} icon={<MenuBookIcon />} iconPosition="start" id="exchange-tab-3" aria-controls="exchange-tabpanel-3" />
                        )}
                    </Tabs>
                    {exchange.website_url && (
                         <Button 
                            variant="contained" 
                            startIcon={<LanguageIcon />}
                            href={`${BASE_API_URL}/exchanges/go/${exchange.slug}`} // Use BASE_API_URL
                            target="_blank" 
                            rel="noopener noreferrer"
                            color="secondary"
                            sx={{ ml: 'auto', color: 'white' }} // Ensure text is white for primary button
                        >
                            Официальный сайт
                        </Button>
                    )}
                </Box>

                <TabPanel value={activeTab} index={0}>
                    <ExchangeDetails exchange={exchange} onRatingClick={handleRatingClick} />
                    <ExchangeReviews
                        exchangeId={exchange.id}
                        exchangeName={exchange.name}
                        showSubmitForm={reviewFormOpen}
                        preselectedRating={reviewFormRating}
                        onCloseSubmitForm={() => setReviewFormOpen(false)}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <ExchangeReviews
                        exchangeId={exchange.id}
                        exchangeName={exchange.name}
                        showSubmitForm={reviewFormOpen}
                        preselectedRating={reviewFormRating}
                        onCloseSubmitForm={() => setReviewFormOpen(false)}
                    />
                </TabPanel>
                {newsCount > 0 && (
                    <TabPanel value={activeTab} index={2}>
                        <Typography variant="h5">Новости биржи {exchange.name}</Typography>
                        <ExchangeNews newsList={newsList} exchange={exchange} />
                    </TabPanel>
                )}
                {guidesCount > 0 && (
                    <TabPanel value={activeTab} index={3}>
                        <Typography variant="h5">Инструкции для {exchange.name}</Typography>
                        {/* Placeholder: Implement ExchangeGuidesList component here */}
                        <Typography>Контент инструкций будет здесь.</Typography>
                        {/* <ExchangeGuidesList exchangeId={exchange.id} /> */}
                    </TabPanel>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default ExchangeDetailsPage;