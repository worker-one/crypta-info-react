import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { Typography } from '@mui/material';
// import ExchangeGuidesList from '../../components/Exchanges/ExchangeGuidesList'; // Placeholder for guides component

const ExchangeGuidesPage = () => {
    const { exchange } = useOutletContext();

    useEffect(() => {
        if (exchange) {
             document.title = `${exchange.name} - Инструкции | Crypta.Info`;
        }
    }, [exchange]);
    
    if (!exchange) {
        return <Typography>Exchange data is not available.</Typography>;
    }

    // Placeholder content, replace with actual guides listing
    return (
        <>
            <Typography variant="h5" sx={{mb: 2}}>Инструкции для {exchange.name}</Typography>
            <Typography>Контент инструкций будет здесь.</Typography>
            {/* 
            <ExchangeGuidesList exchangeId={exchange.id} /> 
            You would fetch and display guides specific to this exchange here,
            or pass guidesList via context if fetched in ExchangeDetailsPage.
            For now, keeping it simple as per original structure.
            */}
        </>
    );
};

export default ExchangeGuidesPage;
