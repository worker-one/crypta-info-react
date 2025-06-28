import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SearchForm from '../../components/common/SearchForm';
import { Container, Box } from '@mui/material';
import BooksTable from '../../components/Books/Table';
import { fetchBookTags } from '../../client/api';
import { useLocation } from 'react-router';

const BooksTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchBookTags();
        setAvailableTags(tags);

        // Check for tag in query string
        const params = new URLSearchParams(location.search);
        const tagId = params.get('tag');
        if (tagId) {
          const foundTag = tags.find(tag => String(tag.id) === String(tagId));
          if (foundTag) {
            setSelectedTags([foundTag]);
          }
        }
      } catch (error) {
        console.error('Error loading book tags:', error);
      }
    };

    loadTags();
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
