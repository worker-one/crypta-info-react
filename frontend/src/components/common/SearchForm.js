import React from 'react';
import { Box, TextField, Chip, Typography, Grid, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

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

  const handleClear = () => {
    // Simulate clearing the input by calling onChange with an empty value
    if (onChange) {
      // If onChange is a synthetic event handler, create a fake event
      if (typeof onChange === 'function') {
        onChange({ target: { value: '' } });
      }
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
        InputProps={{
          endAdornment: (
            value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          ),
        }}
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
