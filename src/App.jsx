import React, { useEffect } from 'react';
import { useLoading } from './contexts/LoadingContext';
import { setGlobalLoadingSetter } from './system/axios';
import AppRouter from './system/router';
import { BrowserRouter } from 'react-router-dom';

const GlobalLoader = () => {
  const { loading } = useLoading();
  const isMobile = useMediaQuery('(max-width:900px)');

  if (!loading) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: isMobile ? '100vw' : '450px',
      width: isMobile ? '100vw' : '450px',
      minWidth: isMobile ? '0' : '200px',
      height: '50px',
      marginTop: isMobile ? '10px' : '20px',
      borderRadius: '100px',
      backgroundColor: 'rgb(255, 255, 255)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.5s',
    }}>
    <Typography sx={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color:"rgb(36, 36, 36)"

        }}>Подкллючение к серверу...</Typography>
   
    </div>
  );
};

const App = () => {
  const { setLoading } = useLoading();
  useEffect(() => {
    setGlobalLoadingSetter(setLoading);
  }, [setLoading]);
  return (
    <>
      <GlobalLoader />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App; 
