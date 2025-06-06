import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button, Link as MuiLink, Avatar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';

// TODO: Move BASE_URL_API to a config.js file and import it
const BASE_URL_API = 'http://176.124.219.116:8300/api/v1';
const DEFAULT_ROWS_PER_PAGE = 20;

const headCells = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false },
  { id: 'name', numeric: false, disablePadding: false, label: 'Биржа', sortable: true, align: 'center' },
  { id: 'overall_average_rating', numeric: true, disablePadding: false, label: 'Рейтинг', sortable: true, align: 'center' },
  { id: 'total_review_count', numeric: true, disablePadding: false, label: 'Отзывы', sortable: true, align: 'center' },
  { id: 'trading_volume_24h', numeric: true, disablePadding: false, label: 'Объем (24ч)', sortable: true, align: 'center' },
  { id: 'has_p2p', numeric: false, disablePadding: false, label: 'P2P', sortable: true, align: 'center' },
  { id: 'has_kyc', numeric: false, disablePadding: false, label: 'KYC', sortable: true, align: 'center' },
  { id: 'website', numeric: false, disablePadding: false, label: 'Сайт', sortable: false, align: 'center' },
];

function formatVolume(volume) {
  if (volume === null || volume === undefined || isNaN(parseFloat(volume))) {
    return 'N/A';
  }
  const numVolume = parseFloat(volume);
  if (numVolume >= 1000000000) {
    return `$${Math.round(numVolume / 1000000000)} млрд`;
  } else if (numVolume >= 1000000) {
    return `$${Math.round(numVolume / 1000000)} млн`;
  } else {
    return `$${numVolume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
}

async function fetchExchangesAPI(params) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL_API}/exchanges/?${query}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json(); // Expects { items: [], total: 0 }
}


const ExchangesTable = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('overall_average_rating');
  const [page, setPage] = useState(0); // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        field: orderBy,
        direction: order,
        limit: rowsPerPage,
        page: page + 1, // API is 1-indexed
      };
      // Remove undefined or null params
      Object.keys(params).forEach(key => (params[key] == null) && delete params[key]);
      
      const data = await fetchExchangesAPI(params);
      setExchanges(data.items || []);
      setTotalRows(data.total || 0);
    } catch (err) {
      setError(err.message);
      setExchanges([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset to first page on sort
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleRowClick = (event, slug) => {
    // Prevent navigation if the click was on a link or button inside the row
    if (event.target.closest('a, button')) {
      return;
    }
    navigate(`details/${slug}`);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 3 }}>Error loading exchanges: {error}</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table stickyHeader aria-label="exchanges table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ textAlign: headCell.id === 'index' || headCell.id === 'website' ? 'center' : headCell.numeric ? 'right' : 'left' }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {exchanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length}>
                  No exchanges found.
                </TableCell>
              </TableRow>
            ) : (
              exchanges.map((exchange, index) => {
                const ratingValue = parseFloat(exchange.overall_average_rating);
                const formattedRating = isNaN(ratingValue) ? 'N/A' : ratingValue.toFixed(1);
                const reviewCount = exchange.total_review_count?.toLocaleString() ?? 'N/A';
                const formattedVolume = formatVolume(exchange.trading_volume_24h);
                const p2pIconSrc = exchange.has_p2p ? "/assets/green-check.png" : "/assets/red-cross.png";
                const kycIconSrc = exchange.has_kyc ? "/assets/green-check.png" : "/assets/red-cross.png";

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleRowClick(event, exchange.slug)}
                    key={exchange.id || exchange.slug}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={exchange.logo_url || '/assets/logo-placeholder.png'} 
                          alt={`${exchange.name} Logo`} 
                          sx={{ width: 32, height: 32, mr: 1 }} 
                          variant="square"
                        />
                        {exchange.name}
                      </Box>
                    </TableCell>
                    <TableCell align='center'>
                      <Box component="span" sx={{ fontWeight: 'bold', color: 'goldenrod' }}>
                        ★ {formattedRating}
                      </Box>
                    </TableCell>
                    <TableCell align='center'>
                      <MuiLink color='secondary' component={RouterLink} to={`/exchanges/details/${exchange.slug}`} onClick={(e) => e.stopPropagation()}>
                        {reviewCount}
                      </MuiLink>
                    </TableCell>
                    <TableCell align='center'>{formattedVolume}</TableCell>
                    <TableCell>
                      <img src={p2pIconSrc} alt={exchange.has_p2p ? "Yes" : "No"} width="20" height="20" />
                    </TableCell>
                    <TableCell>
                      <img src={kycIconSrc} alt={exchange.has_kyc ? "Yes" : "No"} width="20" height="20" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="#636262"
                        href={`${BASE_URL_API}/exchanges/go/${exchange.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Сайт
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count !== -1 ? count : `больше чем ${to}`}`}
      />
    </Paper>
  );
};

export default ExchangesTable;
