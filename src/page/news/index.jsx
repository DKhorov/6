import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import logo from '../../image/1.png';
import '../../style/global.scss';
import axios from '../../system/axios';
import DA4DEDE239161970FBFD1150A62DC2D3EAE984BA from '../../image/DA4DEDE239161970FBFD1150A62DC2D3EAE984BA.webp';
import { selectPanelCurve } from '../../system/redux/slices/store';

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Форматирование даты и времени
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return (
    <Typography sx={{ 
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "Light",
      marginRight:"20px",
      color:"rgba(208, 199, 199, 1)" }}>
      {` ${hours}:${minutes}`}
    </Typography>
  );
};

const NewsPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const panelCurve = useSelector(selectPanelCurve);

  useEffect(() => {
    axios.get('/news')
      .then(res => {
        setNews(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка загрузки новостей');
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        maxWidth: isMobile ? '100vw' : '450px',
        width: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: 1,
        
        overflowY: 'auto',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE и Edge
        '&::-webkit-scrollbar': {
          width: '0px', // Chrome, Safari, Opera
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0, // отступ под MobileMenu
        px: isMobile ? 1 : 0, // горизонтальные отступы
        pt: isMobile ? 0 : 0, // верхний отступ
        mt: isMobile ? 0 : 0, // margin-top для мобильных
      }}
    >
    <Box
            sx={{
              width: '100%',
              height: '50px',
              marginTop: isMobile ? '0' : '20px',
              borderRadius: panelCurve === 'rounded' ? '100px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '100px',
                  backgroundColor: 'rgba(56, 64, 73, 1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: isMobile ? 2 : 0,
              position: 'relative',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 1,
                borderRadius: '100px',
              }}
            />
            <Typography sx={{
              position: 'relative',
              zIndex: 2,
                    fontFamily: "'Arial'",
              fontWeight: "Bold", marginLeft:"20px", color:"rgba(226, 226, 226, 1)"
            }}>
              AtomGlide
            </Typography>
               <DateTimeNow  />
          </Box>
      <Box
          sx={{
            width: '100%',
            height: '200px',
            marginTop: isMobile ? '10px' : '10px',
            borderRadius: '10px',
            backgroundColor: 'rgb(255, 255, 255)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: isMobile ? 2 : 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
             src={require('../../image/2.webp')}
            alt="music-cover"
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          {/* Градиент затемнения */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: '60%',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
              borderRadius: '10px',
              zIndex: 2,
            }}
          />
          {/* Текст вверху слева */}
          <Box
            sx={{
              position: 'absolute',
              left: 20,
              top: 16,
              zIndex: 3,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
              fontSize: '1rem',
              fontFamily: 'inherit',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}
          >
           AtomGlide 
          </Box>
          {/* Текст внизу слева */}
          <Box
            sx={{
              position: 'absolute',
              left: 20,
              bottom: 16,
              zIndex: 3,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.7rem',
              fontFamily: 'inherit',
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            Актуальные новости мира AtomGlide
          </Box>
        </Box>
      <Box sx={{mt: 3 }}>
        {loading && <Typography sx={{textAlign:'center', mt: 2}}>Загрузка новостей...</Typography>}
        {error && <Typography color="error" sx={{textAlign:'center', mt: 4}}>{error}</Typography>}
        {!loading && !error && news.length === 0 && (
          <Typography sx={{textAlign:'center', mt: 4}}>Нет новостей</Typography>
        )}
        {!loading && !error && news.map(item => (
          <Box key={item.id} sx={{
                                    backgroundColor: 'rgba(38, 44, 51, 1)',

            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            p: 2,
            mb: 2,
          }}>
            <Typography variant="h6" sx={{fontWeight: 700, mb: 1,color: 'rgba(255, 255, 255, 1)'}}>{item.title}</Typography>
            <Typography sx={{color: 'rgba(185, 185, 185, 1)', mb: 1}}>{item.description}</Typography>
            <Typography sx={{mb: 1,color: 'rgba(228, 228, 228, 1)'}}>{item.text}</Typography>
            <Typography sx={{fontSize: 12, color: 'rgba(185, 185, 185, 1)', textAlign: 'right'}}>
              {item.author}
            </Typography>
          </Box>
        ))}
               <img src={DA4DEDE239161970FBFD1150A62DC2D3EAE984BA} alt="news" style={{Width: '100px', borderRadius: '12px' , height:"100%"}} />

      </Box>
    </Box>
  );
};

export default NewsPage;
