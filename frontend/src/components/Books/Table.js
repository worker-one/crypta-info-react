import { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button, Link as MuiLink, Avatar,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';

// TODO: Move BASE_URL_API to a config.js file and import it
const BASE_URL_API = 'http://176.124.219.116:8300/api/v1';
const DEFAULT_ROWS_PER_PAGE = 20;

const headCells = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' },
  { id: 'cover', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Литература', sortable: true, align: 'center' },
  { id: 'overall_average_rating', numeric: true, disablePadding: false, label: 'Рейтинг', sortable: false, align: 'center' },
  { id: 'total_review_count', numeric: true, disablePadding: false, label: 'Отзывы', sortable: false, align: 'center' },
  { id: 'year', numeric: true, disablePadding: false, label: 'Год', sortable: false, align: 'center' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Автор', sortable: false, align: 'center' },
  { id: 'actions', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
];


async function fetchBooksAPI(params) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL_API}/books/?${query}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json(); // Expects { items: [], total: 0 }
}


const BooksTable = ({ searchTerm, selectedTags = [] }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('overall_average_rating');
  const [page, setPage] = useState(0); // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        field: orderBy,
        direction: order,
      };

      // If searchTerm is provided, add it to params
      if (searchTerm && searchTerm.length >= 3) {
        params.name = searchTerm;
      }

      // Only add tag filtering if tags are actually selected
      if (selectedTags.length > 0) {
        // For multiple tags, we'll send the first selected tag
        // Backend may need to be updated to support multiple tag filtering
        params.tag_id = selectedTags[0].id;
      }
      // If no tags are selected, don't add tag_id parameter - show all items

      console.log('Fetching books with params:', params); // Debug log

      const response = await fetchBooksAPI(params);
      console.log('Books fetched:', response); // Debug log
      setBooks(response.items || []);
      setTotalRows(response.total || 0);
    } catch (err) {
      setError(err.message);
      setBooks([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage, searchTerm, selectedTags]); // Added searchTerm to dependencies

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset to first page on sort
  };
  const handleChangePage = (_event, newPage) => {
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
    navigate(`/books/${slug}/details`);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 3 }}>Error loading books: {error}</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table stickyHeader aria-label="books table">
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
                      style={{ flexDirection: 'row', justifyContent: 'center' }}
                      
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
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No books found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, index) => {
                const startIndex = page * rowsPerPage;
                const ratingValue = parseFloat(book.overall_average_rating);
                const formattedRating = isNaN(ratingValue) ? 'N/A' : ratingValue.toFixed(1);
                const reviewCount = book.total_review_count?.toLocaleString() ?? 'N/A';

                return (
                  <TableRow
                    hover
                    key={book.id}
                    onClick={(event) => handleRowClick(event, book.slug)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Index */}
                    <TableCell align="center">
                      {startIndex + index + 1}
                    </TableCell>

                    {/* Cover */}
                    <TableCell align="center">
                      <Avatar
                        src={book.logo_url || '../assets/images/book-cover-placeholder.png'}
                        alt={`${book.name || 'Book'} Cover`}
                        variant="square"
                        sx={{ 
                          width: 50, 
                          height: 75, 
                          mx: 'auto',
                          bgcolor: 'grey.200'
                        }}
                      >
                        📚
                      </Avatar>
                    </TableCell>

                    {/* Title */}
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {book.name || 'N/A'}
                      </Typography>
                    </TableCell>

                    {/* Rating */}
                    <TableCell align="center">
                        <Box component="span" sx={{ fontWeight: 'bold', color: 'goldenrod' }}>
                        ★ {formattedRating}
                        </Box>
                    </TableCell>

                    {/* Reviews */}
                    <TableCell align="center">
                        <MuiLink color='secondary' component={RouterLink} to={`/books/${book.slug}/details`} onClick={(e) => e.stopPropagation()}>
                        {reviewCount}
                        </MuiLink>
                    </TableCell>

                    {/* Year */}
                    <TableCell align="center">
                      <Typography variant="body2">
                        {book.year || 'N/A'}
                      </Typography>
                    </TableCell>

                    {/* Author */}
                    <TableCell align="center" >
                      <Typography variant="body2">
                        {book.author || 'Unknown Author'}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/books/${book.slug}/details`}
                        variant="outlined"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ minWidth: 'auto', px: 2 }}
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

export default BooksTable;