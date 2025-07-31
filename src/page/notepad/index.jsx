import { Box, Typography, useMediaQuery, Button } from "@mui/material";
import React, { useState } from 'react';

// Вложенный компонент (вторая "страница")
const SecondPage = ({ onClose }) => {
  return (
    <Box sx={{ 
      p: 2,
      border: '1px solid #ccc',
      borderRadius: 1,
      backgroundColor: '#f9f9f9',
      height: '100%',
    }}>
      <Typography variant="h5">Вторая страница</Typography>
      <Typography>Это контент второй страницы, открытой внутри Notepad.</Typography>
      <Button 
        variant="outlined" 
        onClick={onClose}
        sx={{ mt: 2 }}
      >
        Закрыть
      </Button>
    </Box>
  );
};

// Основной компонент Notepad
const Notepad = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [showSecondPage, setShowSecondPage] = useState(false);

  const toggleSecondPage = () => {
    setShowSecondPage(!showSecondPage);
  };

  return (
    <Box sx={isMobile ? {
      maxWidth: '100vw',
      width: '100vw',
      minWidth: 0,
      height: 'calc(100vh - 60px)',
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        width: '0px',
        background: 'transparent',
      },
      paddingBottom: '70px',
      px: 2,
      pt: 1,
      mt: 2,
    } : {
      maxWidth: '730px',
      width: '730px',
      minWidth: '200px',
      height: '100vh',
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        width: '0px',
        background: 'transparent',
      },
    }}>
      {!showSecondPage ? (
        <>
          <Typography variant="h6">Главная страница Notepad</Typography>
          <Button 
            variant="contained" 
            onClick={toggleSecondPage}
            sx={{ mt: 2 }}
          >
            Открыть вторую страницу
          </Button>
        </>
      ) : (
        <SecondPage onClose={toggleSecondPage} />
      )}
    </Box>
  );
};

export default Notepad;