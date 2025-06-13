import React from 'react';
import { Box, TextField, Chip, Typography, Grid } from '@mui/material';

const SearchForm = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  tags = [], 
  selectedTags = [], 
  onTagsChange, 
  showTagFilter = false,
  ...props 
}) => {
  const handleTagToggle = (tag) => {
    const isSelected = selectedTags.some(selected => selected.id === tag.id);
    if (isSelected) {
      // Remove tag
      onTagsChange(selectedTags.filter(selected => selected.id !== tag.id));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        variant="outlined"
        value={value}
        onChange={onChange}
        sx={{ mb: showTagFilter ? 2 : 0 }}
        {...props}
      />
      {showTagFilter && tags.length > 0 && (
        <Box>
          <Grid container spacing={1}>
            {tags.map((tag) => {
              const isSelected = selectedTags.some(selected => selected.id === tag.id);
              return (
                <Grid item key={tag.id}>
                  <Chip
                    label={tag.name}
                    clickable
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    onClick={() => handleTagToggle(tag)}
                    sx={{
                      '&:hover': {
                        backgroundColor: isSelected 
                          ? 'primary.dark' 
                          : 'action.hover'
                      }
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;
