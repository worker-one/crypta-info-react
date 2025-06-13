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
import { getExchangeDetails, fetchExchangeNews, fetchExchangeGuides, BASE_API_URL, getNewsItem } from '../../client/api'; // Adjust path
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';


const ExchangeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [exchange, setExchange] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewFormRating, setReviewFormRating] = useState(0);

    useEffect(() => {
        if (!id) {
            setError('ID новости не указан.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        getNewsItem(id)
            .then(item => {
                setNews(item);
                document.title = `${item.title} | Crypta.Info`;
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Не удалось загрузить новость.');
                setIsLoading(false);
            });
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleRatingClick = (rating) => {
        setActiveTab(1); // Switch to "Отзывы" tab
        setReviewFormOpen(true);
        setReviewFormRating(rating);
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (isLoading) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress size={60} /></Container>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container sx={{ flex: 1, mt: 4, mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <MuiLink component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </MuiLink>
                    <MuiLink component="button" onClick={() => navigate('/exchanges')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        Биржи
                    </MuiLink>
                    <Typography color="text.primary">Новости биржи</Typography>
                </Breadcrumbs>

                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {!isLoading && news && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {news.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {news.published_at ? new Date(news.published_at).toLocaleString() : ''}
                        </Typography>
                        {news.image && (
                            <img
                                src={news.image}
                                alt={news.title}
                                style={{ width: '100%', height: 'auto', marginBottom: '16px' }}
                            />
                        )}
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                            {news.content || news.text}
                        </Typography>
                        {news.source_url && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Источник: <a href={news.source_url} target="_blank" rel="noopener noreferrer">{news.source_url}</a>
                            </Typography>
                        )}
                    </Paper>
                )}
                {!isLoading && !news && !error && (
                    <Typography sx={{ mt: 2 }}>Новость не найдена.</Typography>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default ExchangeDetailsPage;