import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, Breadcrumbs, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getNewsItem } from '../../client/api.js';

// Accept newsList and exchange as props
const ExchangeNews = ({ newsList, exchange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedNews, setSelectedNews] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', content: '' });

    const handleNewsClick = (newsId) => {
        setLoading(true);
        setError('');
        getNewsItem(newsId)
            .then(item => {
                setSelectedNews(item);
                setLoading(false);
            })
            .catch(e => {
                setError('Не удалось загрузить новость. ' + (e.message || ''));
                setLoading(false);
            });
    };

    const handleBackToList = () => {
        setSelectedNews(null);
        setError('');
    };

    const handleReadMore = (news) => {
        setDialogContent({ title: news.title, content: news.content });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (!exchange) return null;

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href={`/exchange/${exchange.slug}`}>
                    {exchange.name}
                </Link>
                {!selectedNews ? (
                    <Typography color="text.primary">Новости биржи</Typography>
                ) : (
                    <>
                        <Link underline="hover" color="inherit" href="#" onClick={handleBackToList}>
                            Новости биржи
                        </Link>
                        <Typography color="text.primary">{selectedNews.title}</Typography>
                    </>
                )}
            </Breadcrumbs>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {!selectedNews ? `Новости биржи ${exchange.name}` : selectedNews.title}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && !selectedNews && (
                <Grid container spacing={2}>
                    {newsList.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ p: 4 }}>
                                Нет новостей для этой биржи
                            </Typography>
                        </Grid>
                    ) : (
                        newsList.map(news => (
                            <Grid item xs={12} size={10} md={6} key={news.id}>
                                <Paper
                                    sx={{ p: 2, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                    elevation={3}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {news.title}
                                    </Typography>
                                    {news.image && (
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
                                        />
                                    )}
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {news.date_published ? new Date(news.date_published).toLocaleString() : ''}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {news.summary || news.text?.slice(0, 120) || ''}
                                        {news.text && news.text.length > 120 ? '...' : ''}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                                        component="a"
                                        href={`/exchanges/news/${news.id}`}
                                    >
                                        Читать подробнее
                                    </Button>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {news.published_at ? new Date(news.published_at).toLocaleString() : ''}
                                    </Typography>
                                    {news.source_url && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Источник: <a href={news.source_url} target="_blank" rel="noopener noreferrer">{news.source_url}</a>
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
            {!loading && selectedNews && (
                <Paper sx={{ p: 3 }}>
                    <Button onClick={handleBackToList} sx={{ mb: 2 }}>
                        ← Назад к списку новостей
                    </Button>
                    <Typography variant="h5" gutterBottom>
                        {selectedNews.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedNews.date_published ? new Date(selectedNews.date_published).toLocaleString() : ''}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedNews.text}
                    </Typography>
                </Paper>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{dialogContent.title}</DialogTitle>
                <DialogContent dividers>
                    <div dangerouslySetInnerHTML={{ __html: dialogContent.content }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExchangeNews;