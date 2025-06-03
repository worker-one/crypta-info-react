import React from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import { Container, Typography, Box } from '@mui/material';
import ExchangesTable from '../../components/Exchanges/ExchangesTable';


const ExchangesTablePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <ExchangesTable />
      </Container>
      <Footer />
    </Box>
  );
};

export default ExchangesTablePage;
