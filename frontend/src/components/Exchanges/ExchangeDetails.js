// filepath: /home/konstantin/workspace/crypta-info-react/frontend/src/components/ExchangeDetails/ExchangeInfo.js
import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatVolume } from '../../utils/formatters'; // Adjust path
import { BASE_API_URL } from '../../client/api'; // Adjust path
import { Container } from '@mui/system';

const ExchangeDetails = ({ exchange, onRatingClick }) => {
    if (!exchange) return null;

    const [hoveredRating, setHoveredRating] = useState(-1);
    const [selectedRating, setSelectedRating] = useState(null);

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
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3, flexWrap: 'nowrap', justifyContent: 'space-around' }}>
                    <Grid item xs="auto"> {/* Logo - Changed sizing, removed sx */}
                        <Avatar src={exchange.logo_url || '../assets/images/logo-placeholder.png'} alt={`${exchange.name} Logo`} sx={{ width: 56, height: 56 }} />
                    </Grid>

                    {/* Name */}
                    <Grid item xs="auto"> {/* Changed sizing from xs to xs="auto" */}
                        <Typography variant="h6" noWrap>{exchange.name}</Typography>
                    </Grid>

                    <Grid item xs="auto"> {/* Rating - Removed spacing={2} prop */}
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => {
                                if (onRatingClick && (hoveredRating > 0 || selectedRating > 0)) {
                                    onRatingClick(hoveredRating > 0 ? hoveredRating : selectedRating);
                                }
                            }}
                        >
                            <Rating
                                value={hoveredRating > 0 ? hoveredRating : (selectedRating || parseFloat(exchange.overall_average_rating) || 0)}
                                precision={1}
                                onChange={(_, value) => setSelectedRating(value)}
                                onChangeActive={(_, value) => setHoveredRating(value)}
                                onMouseLeave={() => setHoveredRating(-1)}
                            />
                            <Typography variant='subtitle1' color="text.secondary" align='center' sx={{ mt: 1 }}>
                                {exchange.total_rating_count || 0} отзывов
                            </Typography>
                        </Box>
                    </Grid>
                    {/* Volume */}
                    {exchange.trading_volume_24h && (
                        <Grid item xs="auto"> {/* Changed sizing, removed sx and other breakpoints */}
                            <Typography variant="h6">{formatVolume(exchange.trading_volume_24h)}</Typography>
                            <Typography variant="subtitle1" color="text.secondary" align='center'>Объем (24ч)</Typography>
                        </Grid>
                    )}
                    {exchange.year_founded && (
                        <Grid item xs="auto"> {/* Changed sizing, removed sx and other breakpoints */}
                            <Typography variant="h6" align='center'>{exchange.year_founded}</Typography>
                            <Typography variant="subtitle1" color="text.secondary" align='center'>Год Основания</Typography>
                        </Grid>
                    )}
                    {exchange.registration_country?.name && (
                        <Grid item xs="auto"> {/* Changed sizing, removed other breakpoints */}
                            <Typography variant="h6">{exchange.registration_country.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary" align='center'>Страна</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {exchange.overview && (
                <Box sx={{ mb: 3, mt: 2 }}>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: exchange.overview }} />
                </Box>
            )}

            <Grid container spacing={3} alignItems="stretch" sx={{ mt: 2 }}> {/* Added alignItems="stretch" and sx={{ mt: 2 }} for spacing from above Paper */}
                {showServicesCard && (
                    <Grid item size={6} xs={6} md={6}> {/* Added item prop */}
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}> {/* Added height: '100%' */}
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
                    <Grid item size={6} xs={12} md={6}> {/* Added item prop */}
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}> {/* Added height: '100%' */}
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
                            {/* {exchange.slug && (
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
                            )} */}
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {exchange.overview && (
                <Box sx={{ mb: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>Описание</Typography>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: exchange.description }} />
                </Box>
            )}

        </Container>
    
    );
};

const ServiceItem = ({ label, status }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
        <Typography>{label}:</Typography>
        {status ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
    </Box>
);


export default ExchangeDetails;