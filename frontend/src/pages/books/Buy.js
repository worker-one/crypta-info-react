import React from 'react';
import { useOutletContext } from 'react-router';
import { Typography, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const BookBuyPage = () => {
    const { book } = useOutletContext();

    return (
        <>
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
        </>
    );
};

export default BookBuyPage;
