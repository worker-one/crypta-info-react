import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { fetchStaticPage } from '../client/api';

const StaticPage = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get slug from the last part of the URL
    const slug = window.location.pathname.split('/').pop() || 'home';
    console.log('StaticPage slug:', slug); // Debugging log

    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchStaticPage(slug);
                setPage(data);
            } catch (err) {
                setError(err.message || 'Failed to load page.');
            } finally {
                setLoading(false);
            }
        };
        loadPage();
    }, [slug]);

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
                {error && <Alert severity="error">{error}</Alert>}
                {page && (
                    <>
                        <Typography variant="h4" gutterBottom>{page.title}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <div dangerouslySetInnerHTML={{ __html: page.content }} />
                        </Box>
                    </>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default StaticPage;
export { StaticPage };
