// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/ExchangeDetails/ExchangeInfo.js
import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatVolume } from '../../utils/formatters'; // Adjust path
import { BASE_API_URL } from '../../client/api'; // Adjust path

const ExchangeDetails = ({ exchange }) => {
    if (!exchange) return null;

    const renderServiceStatus = (hasService) => (
        hasService ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
    );

    const showServicesCard = exchange.has_copy_trading ||
                             exchange.has_p2p ||
                             exchange.has_staking ||
                             exchange.has_futures ||
                             exchange.has_spot_trading ||
                             exchange.has_demo_trading;

    const showFeesCard = exchange.spot_taker_fee || exchange.spot_maker_fee || exchange.futures_taker_fee || exchange.futures_maker_fee;

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid sx={{ mr: 2 }}> {/* Logo */}
                    <Avatar src={exchange.logo_url || '../assets/images/logo-placeholder.png'} alt={`${exchange.name} Logo`} sx={{ width: 56, height: 56 }} />
                </Grid>

                {/* Name */}
                <Grid xs={10} sm md={3} sx={{ mr: 6 }}> 
                    <Typography variant="h4">{exchange.name}</Typography>
                </Grid>

                <Grid xs={12} sm={6} md={3} sx={{ mr: 6 }}> {/* Rating */}
                    <Rating value={parseFloat(exchange.overall_average_rating) || 0} precision={0.1} />
                    <Typography variant='subtitle1' color="text.secondary" align='center' sx={{ ml: 1 }}>{exchange.total_rating_count || 0} отзывов</Typography>
                </Grid>
                <Grid xs={6} sm={6} md={2} sx={{ mr: 6 }}> {/* Volume */}
                    <Typography variant="h6">{formatVolume(exchange.trading_volume_24h)}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" align='center'>Объем (24ч)</Typography>
                </Grid>
                <Grid xs={6} sm={6} md={2} sx={{ mr: 6 }}> {/* Year Founded */}
                    <Typography variant="h6">{exchange.year_founded || 'N/A'}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" align='center'>Год Основания</Typography>
                </Grid>
                <Grid xs={12} sm={6} md={2}> {/* Country */}
                    <Typography variant="h6">{exchange.registration_country?.name || 'N/A'}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" align='center'>Страна</Typography>
                </Grid>
            </Grid>

            {exchange.overview && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Описание</Typography>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: exchange.overview }} />
                </Box>
            )}

            <Grid container spacing={3}>
                {showServicesCard && (
                    <Grid xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Сервисы</Typography>
                            <Box>
                                <ServiceItem label="Копитрейдинг" status={exchange.has_copy_trading} />
                                <ServiceItem label="P2P Обмен" status={exchange.has_p2p} />
                                <ServiceItem label="Стейкинг" status={exchange.has_staking} />
                                <ServiceItem label="Фьючерсы" status={exchange.has_futures} />
                                <ServiceItem label="Спотовая торговля" status={exchange.has_spot_trading} />
                                <ServiceItem label="Демо трейдинг" status={exchange.has_demo_trading} />
                            </Box>
                        </Paper>
                    </Grid>
                )}

                {showFeesCard && (
                    <Grid xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Комиссии и бонусы</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell align="center">Тейкер</TableCell>
                                            <TableCell align="center">Мейкер</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>Спот</strong></TableCell>
                                            <TableCell align="center">{exchange.spot_taker_fee ? `${(parseFloat(exchange.spot_taker_fee) * 100).toFixed(2)}%` : 'N/A'}</TableCell>
                                            <TableCell align="center">{exchange.spot_maker_fee ? `${(parseFloat(exchange.spot_maker_fee) * 100).toFixed(2)}%` : 'N/A'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>Фьючерсы</strong></TableCell>
                                            <TableCell align="center">{exchange.futures_taker_fee ? `${(parseFloat(exchange.futures_taker_fee) * 100).toFixed(2)}%` : 'N/A'}</TableCell>
                                            <TableCell align="center">{exchange.futures_maker_fee ? `${(parseFloat(exchange.futures_maker_fee) * 100).toFixed(2)}%` : 'N/A'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {exchange.slug && (
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        href={`${BASE_API_URL}/exchanges/go/${exchange.slug}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Получить бонус
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

const ServiceItem = ({ label, status }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
        <Typography>{label}:</Typography>
        {status ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
    </Box>
);


export default ExchangeDetails;