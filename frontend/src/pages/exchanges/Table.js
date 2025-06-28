import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SearchForm from '../../components/common/SearchForm';
import { Container, Box } from '@mui/material';
import ExchangesTable from '../../components/Exchanges/ExchangesTable';
import { fetchExchangeTags } from '../../client/api';
import { useLocation } from 'react-router';


const ExchangesTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchExchangeTags();
        setAvailableTags(tags);

        // Check for tag query param and set selectedTags accordingly
        const params = new URLSearchParams(location.search);
        const tagId = params.get('tag');
        if (tagId) {
          const tagObj = tags.find(t => String(t.id) === String(tagId));
          if (tagObj) {
            setSelectedTags([tagObj]);
          }
        }
      } catch (error) {
        console.error('Error loading exchange tags:', error);
      }
    };

    loadTags();
    // Only run on mount and when location.search changes
    // eslint-disable-next-line
  }, [location.search]);

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
