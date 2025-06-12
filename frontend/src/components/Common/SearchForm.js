import React from 'react';
import { Box, TextField, Autocomplete, Chip } from '@mui/material';

const SearchForm = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  tags = [], 
  selectedTags = [], 
  onTagsChange, 
  showTagFilter = false,
  tagLabel = "Фильтр по тегам",
  ...props 
}) => {
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
      {showTagFilter && (
        <Autocomplete
          multiple
          options={tags}
          getOptionLabel={(option) => option.name}
          value={selectedTags}
          onChange={(event, newValue) => {
            onTagsChange(newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.name}
                {...getTagProps({ index })}
                key={option.id}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={tagLabel}
              placeholder="Выберите теги для фильтрации"
            />
          )}
        />
      )}
    </Box>
  );
};

export default SearchForm;
