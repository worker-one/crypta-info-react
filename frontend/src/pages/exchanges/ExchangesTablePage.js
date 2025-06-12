import React, { useState } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import SearchForm from '../../components/Common/SearchForm';
import { Container, Box } from '@mui/material';
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
        <SearchForm
          label="Поиск по названию биржи"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <ExchangesTable searchTerm={searchTerm} />
      </Container>
      <Footer />
    </Box>
  );
};

export default ExchangesTablePage;
