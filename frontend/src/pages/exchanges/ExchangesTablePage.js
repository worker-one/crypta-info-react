import React, { useState } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import { Container, Typography, Box, TextField } from '@mui/material';
import ExchangesTable from '../../components/Exchanges/ExchangesTable';


const ExchangesTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Поиск по названию биржи"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <ExchangesTable searchTerm={searchTerm} />
      </Container>
      <Footer />
    </Box>
  );
};

export default ExchangesTablePage;
