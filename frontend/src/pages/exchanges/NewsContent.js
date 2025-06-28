import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { Typography } from '@mui/material';
import ExchangeNews from '../../components/Exchanges/ExchangeNews'; // Assuming this component exists

const ExchangeNewsPage = () => {
    const { exchange, newsList } = useOutletContext();

    useEffect(() => {
        if (exchange) {
             document.title = `${exchange.name} - Новости | Crypta.Info`;
        }
    }, [exchange]);

    if (!exchange) {
        return <Typography>Exchange data is not available.</Typography>;
    }

    if (!newsList || newsList.length === 0) {
        return <Typography>Нет новостей для этой биржи.</Typography>;
    }
    
    return (
        <>
            <Typography variant="h5" sx={{mb: 2}}>Новости биржи {exchange.name}</Typography>
            <ExchangeNews newsList={newsList} exchange={exchange} />
        </>
    );
};

export default ExchangeNewsPage;
