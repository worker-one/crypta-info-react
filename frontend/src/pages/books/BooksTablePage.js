import React, { useState, useEffect } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import SearchForm from '../../components/Common/SearchForm';
import { Container, Typography, Box } from '@mui/material';
import BooksTable from '../../components/Books/BooksTable';
import { fetchBookTags } from '../../client/api';

const BooksTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchBookTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading book tags:', error);
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
          label="Поиск по названию книги"
          value={searchTerm}
          onChange={handleSearchChange}
          showTagFilter={true}
          tags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          tagLabel="Фильтр по тегам"
        />
        <BooksTable searchTerm={searchTerm} selectedTags={selectedTags} />
      </Container>
      <Footer />
    </Box>
  );
};

export default BooksTablePage;
