import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import MusicItems from './MusicItems';


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
        color:"rgb(5, 5, 5)" }}>
        {`${day}, ${date} ${month} ${hours}:${minutes}`}
      </Typography>
    );
  };

const MusicPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://atomglidedev.ru/music')
      .then(res => {
        let data = Array.isArray(res.data) ? res.data : [];
        // Если cover не абсолютный путь, добавляем домен
        data = data.map(track => ({
          ...track,
          cover: track.cover && !/^https?:\/\//.test(track.cover)
            ? 'https://atomglidedev.ru' + track.cover
            : track.cover
        }));
        setTracks(data);
      })
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          color: 'text.secondary',
        }}
      >
        atomglide 9.0
      </Typography>

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
        maxWidth: '450px',
        width: '450px',
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
        <Box
          sx={{
            width: '100%',
            height: '50px',
            marginTop: isMobile ? '10px' : '20px',
            borderRadius: '100px',
            backgroundColor: 'rgb(255, 255, 255)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: isMobile ? 2 : 0,
          }}
        >
          <Typography sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: "Bold",
            marginLeft: "20px",
            color: "rgb(36, 36, 36)"
          }}>Музыка</Typography>
          <DateTimeNow />
        </Box>

        {/* Баннер */}
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
            src={require('../../image/images-2.webp')}
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
           AtomGlide Music
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
            The Beatles
          </Box>
        </Box>
        {/* Музыкальные карточки */}
        {loading ? <div style={{marginTop: 40, textAlign: 'center'}}>Загрузка...</div> : <MusicItems tracks={tracks} />}
      </Box>
    </>
  );
};

export default MusicPage;
