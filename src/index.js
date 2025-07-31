import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Typography, Divider } from '@mui/material';
import { createNormalizedTheme } from './system/normalize';
import AppRouter from './system/router';
import './fonts/stylesheet.css';
import './style/global.scss';
import { Provider } from 'react-redux';
import store from './system/redux/store';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { setGlobalLoadingSetter } from './system/axios';
import logo from './image/1.png';
import NewsPage from './page/news/index.jsx';
import { useDispatch } from 'react-redux';
import { fetchUser } from './system/redux/slices/getme';
import ErrorBoundary from './system/boot';
import { tips } from './system/data';
import initPerformanceOptimizations from './system/performance';

const EpicLoader = () => {
  const { loading, initialLoading } = useLoading();
  const [tipIndex, setTipIndex] = React.useState(() => Math.floor(Math.random() * tips.length));

  React.useEffect(() => {
    if (!initialLoading && !loading) return;
    // Упрощаем логику смены советов - только один совет за время загрузки
    const timer = setTimeout(() => {
      if (initialLoading || loading) {
        setTipIndex(prev => (prev + 1) % tips.length);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [initialLoading, loading]);

  if (!initialLoading && !loading) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  backgroundColor: 'rgba(64, 64, 64, 0.42)',

      zIndex: 9999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.3s',
      
    }}>
      <div style={{ width: "400px", height: "270px",             backgroundColor: 'rgba(21, 24, 28, 1)'
, position: 'relative'  , borderRadius:"10px" , marginTop: "-60px", paddingLeft:'20px', paddingRight:'20px'}}>
        <div style={{ position: 'absolute', top: 18, right: 20, display: 'flex', gap: 8 }}>
          <div style={{ width: 15, height: 15, borderRadius: 100, background: 'rgba(255, 196, 0, 1)', boxShadow: '0 1px 4px #ffbd2e33' }} />
          <div style={{ width: 15, height: 15, borderRadius: 100, background: 'rgba(221, 44, 44, 1)', boxShadow: '0 1px 4px #ff5f5633' }} />
        </div>

      
        <h2 style={{textAlign:'center', fontFamily:'Yandex Sans', marginTop:'55px' , color:'white'}}>AtomGlide</h2>
        <Typography sx={{
                        fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                        textAlign:'center',
                        fontSize:'16px',
                        marginTop:"0px",
                        color:"rgb(120, 120, 120)",
                        mb: 2
          }}>Сервис для общения, работы</Typography>
        <center><span className="loader"></span></center>
        <Typography sx={{
                        fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                        textAlign:'center',
                        fontSize:'12px',
                        marginTop:"0px",
                        color:"rgb(205, 205, 205)",
                        mb: 2
          }}>Идет запрос к серверу</Typography>
        <Divider sx={{ width: '80%', mx: 'auto', my: 1.5 }} />
        {/* Совет из tips.js */}
        <Typography sx={{
                        fontFamily: "'JetBrains Mono', 'Yandex Sans', Arial, Helvetica, sans-serif",
                        textAlign:'center',
                        fontSize:'13px',
                        marginTop:"8px",
                        color:"#1976d2",
                        mb: 1,
                        px: 2,
                        wordBreak: 'break-word',
                        fontWeight: 500,
          }}>{tips[tipIndex]}</Typography>
      </div>
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 25,
          zIndex: 1000,
          color: 'text.secondary',
          fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
          fontSize: '14px',
          userSelect: 'none',
        }}
      >
       RU{' '}
       <span
         style={{
           color: '#1976d2',
           cursor: 'pointer',
           textDecoration: 'underline',
           transition: 'color 0.2s',
           margin: '0 3px',

         }}
         onClick={() => window.open('https://dkhorov.github.io/AtomWiki/', '_blank')}
         onMouseOver={e => e.target.style.color = '#125ea2'}
         onMouseOut={e => e.target.style.color = '#1976d2'}
       >
         Информациный центр
       </span>{' '}
       © 2025, DK Studio
      </Typography>
   
    </div>
  );
};

const EpicLoaderInit = ({ children }) => {
  const { setLoading } = useLoading();
  useEffect(() => {
    setGlobalLoadingSetter(setLoading);
  }, [setLoading]);
  return <>{children}</>;
};

const EpicUserInit = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return <>{children}</>;
};

if (!localStorage.getItem('token') && window.location.pathname !== '/login' && window.location.pathname !== '/registration') {
  window.location.replace('/login');
}

// Инициализируем оптимизации производительности
initPerformanceOptimizations();

const theme = createNormalizedTheme(createTheme());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoadingProvider>
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <EpicLoader />
            <EpicLoaderInit>
              <EpicUserInit>
                <BrowserRouter>
                  <AppRouter />
                </BrowserRouter>
              </EpicUserInit>
            </EpicLoaderInit>
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  </LoadingProvider>
);