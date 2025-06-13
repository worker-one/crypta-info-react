import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button, Link as MuiLink, Avatar,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { flex } from '@mui/system';

// TODO: Move BASE_URL_API to a config.js file and import it
const BASE_URL_API = 'http://176.124.219.116:8300/api/v1';
const DEFAULT_ROWS_PER_PAGE = 20;

const headCells = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' }, // Added align: 'center'
  { id: 'name', numeric: false, disablePadding: false, label: 'Биржа', sortable: true, align: 'center' },
  { id: 'overall_average_rating', numeric: true, disablePadding: false, label: 'Рейтинг', sortable: true, align: 'center' },
  { id: 'total_review_count', numeric: true, disablePadding: false, label: 'Отзывы', sortable: true, align: 'center' },
  { id: 'trading_volume_24h', numeric: true, disablePadding: false, label: 'Объем (24ч)', sortable: true, align: 'center' },
  { id: 'details', numeric: false, disablePadding: false, label: ' ', sortable: false, align: 'center' },
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


const ExchangesTable = ({ searchTerm, selectedTags = [] }) => { // Added searchTerm prop
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0); // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchExchanges = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        direction: order,
      };

      // If searchTerm is provided, add it to params
      if (searchTerm && searchTerm.length >= 3) {
        params.name = searchTerm;
      }

      // If orderBy is set, add it to params
      if (orderBy) {
        params.order_by = orderBy;
      }
      // Only add tag filtering if tags are actually selected
      if (selectedTags.length > 0) {
        // For multiple tags, we'll send the first selected tag
        // Backend may need to be updated to support multiple tag filtering
        params.tag_id = selectedTags[0].id;
      }
      // If no tags are selected, don't add tag_id parameter - show all items

      const response = await fetchExchangesAPI(params);
      setExchanges(response.items || []);
      setTotalRows(response.total || 0);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      setError('Failed to load exchanges');
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage, searchTerm, selectedTags]); // Added searchTerm to dependencies

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
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                      style={flex({
                        flexDirection: 'row',
                        justifyContent: headCell.align === 'center' ? 'center' : headCell.align === 'right' ? 'flex-end' : 'flex-start',
                      })}
                    >
                      <Box sx={{ position: 'relative', left: '10px' /* Adjust this value e.g., '2px' or '-2px' */ }}>
                        {headCell.label}
                      </Box>
                    </TableSortLabel>
                  ) : (
                    <Box sx={{ position: 'relative', left: '0px', display: 'inline-block' /* Adjust this value */ }}>
                      {headCell.label}
                    </Box>
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

                    {/* Reviews */}
                    <TableCell align='center'>
                      <MuiLink color='secondary' component={RouterLink} to={`/exchanges/details/${exchange.slug}`} onClick={(e) => e.stopPropagation()}>
                        {reviewCount}
                      </MuiLink>
                    </TableCell>
                    
                    <TableCell align='center'>{formattedVolume}</TableCell>
                    {/* <TableCell align='center'>
                      <img src={p2pIconSrc} alt={exchange.has_p2p ? "Yes" : "No"} width="20" height="20" />
                    </TableCell>
                    <TableCell align='center'>
                      <img src={kycIconSrc} alt={exchange.has_kyc ? "Yes" : "No"} width="20" height="20" />
                    </TableCell> */}
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="#636262"
                        href={`${BASE_URL_API}/${exchange.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Обзор
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
        labelRowsPerPage="Показать:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count !== -1 ? count : `больше чем ${to}`}`}
      />
    </Paper>
  );
};

export default ExchangesTable;
