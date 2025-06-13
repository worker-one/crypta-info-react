import React, { useState, useEffect } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import SearchForm from '../../components/Common/SearchForm';
import { Container, Box } from '@mui/material';
import ExchangesTable from '../../components/Exchanges/ExchangesTable';
import { fetchExchangeTags } from '../../client/api';


const ExchangesTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchExchangeTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading exchange tags:', error);
      }
    };

    loadTags();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <SearchForm
          label="Поиск по названию биржи"
          value={searchTerm}
          onChange={handleSearchChange}
          showTagFilter={true}
          tags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
        />
        <ExchangesTable searchTerm={searchTerm} selectedTags={selectedTags} />
      </Container>
      <Footer />
    </Box>
  );
};

export default ExchangesTablePage;
