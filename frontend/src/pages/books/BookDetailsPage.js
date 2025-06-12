// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/pages/books/BookDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Tabs, Tab, Box, CircularProgress, Alert, Typography, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import BookDetails from '../../components/Books/BookDetails';
import ReviewsSection from '../../components/Reviews/ReviewsSection';

import { getBookDetails, BASE_API_URL } from '../../client/api';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`book-tabpanel-${index}`}
            aria-labelledby={`book-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [preselectedRating, setPreselectedRating] = useState(0); // New state for preselected rating

    useEffect(() => {
        if (!id) {
            setError('Book ID not provided.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        getBookDetails(id)
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
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        if (newValue !== 1) { // If navigating away from reviews tab or to a different tab
            setPreselectedRating(0); // Reset preselected rating
        }
    };

    const handleRatingClick = (rating) => {
        setPreselectedRating(rating);
        setActiveTab(1); // Switch to Reviews Tab
    };

    if (isLoading) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress size={60} /></Container>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
    if (!book) return <Container><Typography sx={{mt:2}}>Книга не найдена.</Typography></Container>;
    console.log('Book details:', book); // Debugging log
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container sx={{ flex: 1 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2}}>
                    <MuiLink component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </MuiLink>
                    <MuiLink component="button" onClick={() => navigate('/books')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                        Книги
                    </MuiLink>
                    <Typography color="text.primary">{book.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="Book details tabs">
                        <Tab label="Обзор" icon={<InfoIcon />} iconPosition="start" id="book-tab-0" aria-controls="book-tabpanel-0" />
                        <Tab label={`Отзывы (${book.total_review_count || 0})`} icon={<ReviewsIcon />} iconPosition="start" id="book-tab-1" aria-controls="book-tabpanel-1" />
                        <Tab label="Где купить" icon={<ShoppingCartIcon />} iconPosition="start" id="book-tab-2" aria-controls="book-tabpanel-2" />
                    </Tabs>
                    {book.purchase_links && book.purchase_links.length > 0 && (
                        <Button 
                            variant="contained" 
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => {
                                setActiveTab(2);
                                setPreselectedRating(0); // Reset preselected rating
                            }}
                            color="secondary"
                            sx={{ ml: 'auto', color: 'white' }}
                        >
                            Купить книгу
                        </Button>
                    )}
                </Box>

                <TabPanel value={activeTab} index={0}>
                    <BookDetails book={book} onRatingSelect={handleRatingClick} />
                    <ReviewsSection itemId={book.id} itemName={book.name} />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <ReviewsSection itemId={book.id} itemName={book.name} preselectedRating={preselectedRating} />
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                    <Typography variant="h5" gutterBottom>Где купить "{book.name}"</Typography>
                    {book.purchase_links && book.purchase_links.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {book.purchase_links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<ShoppingCartIcon />}
                                    sx={{ justifyContent: 'flex-start', p: 2 }}
                                >
                                    {link.store}
                                </Button>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2, mb: 10 }}>
                            <Typography variant="body1" color="text.secondary">
                                Ссылки для покупки недоступны.
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </Container>

            <Footer />
        </Box>
    );
};

export default BookDetailsPage;