import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography, IconButton } from '@mui/material';
import axios from '../system/axios';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const fadeInStyle = {
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
};
const fadeOutStyle = {
  opacity: 0,
  transform: 'translateY(40px)',
};

function ThrowErrorButton() {
  const [error, setError] = useState(false);
  if (error) {
    throw new Error('Это кастомная ошибка!');
  }
  return (
    <button
      onClick={() => setError(true)}
      style={{
        margin: 20,
        padding: 10,
        background: '#b71c1c',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        fontWeight: 'bold',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      Вызвать ошибку
    </button>
  );
}

const WidgetMain = React.memo(() => {
  const [count, setCount] = useState(null);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [noth, setnoth] = useState(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/postNumbers')
      .then(res => setCount(res.data.posts))
      .catch(err => console.error('Ошибка при получении данных:', err));
    // Плавное появление
    mountedRef.current = true;
    setTimeout(() => setMounted(true), 50);
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const fetchNotifications = () => {
      axios.get('/notifications')
        .then(res => setnoth(res.data))
        .catch(err => console.error('Ошибка при получении уведомлений:', err));
    };
    fetchNotifications();
    const handler = () => fetchNotifications();
    window.addEventListener('refresh-notifications', handler);
    return () => window.removeEventListener('refresh-notifications', handler);
  }, []);

  useEffect(() => {
    const fetchBalance = () => {
      axios.get('/auth/balance')
        .then(res => setBalance(res.data.balance))
        .catch(() => setBalance('...'));
    };
    fetchBalance();
    // Обновлять баланс при фокусе на карточке
    const handler = () => fetchBalance();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  const handleClearNotifications = async () => {
    try {
      await axios.post('/auth/clear-notifications');
      setnoth([]);
    } catch (err) {
      alert('Ошибка при очистке уведомлений');
    }
  };

  const cards = [
    {
      label: 'Постов',
      value: count,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: '15px',
      mr: undefined,
    },
    {
      label: 'Каналов',
      value: 6,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',

      ml: undefined,
      mr: '15px',
    },
    {
      label: 'Версия',
      value: 9.6,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: '15px',
      mr: undefined,
    },
    {
      label: 'Баланс',
      value: balance === null ? '...' : Math.floor(balance),
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: undefined,
      mr: '15px',
    },
  ];

  return (
    <Box
      sx={{
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative',
        ...(!mounted ? fadeOutStyle : fadeInStyle),
      }}
    >
      {/* Верхняя кнопка */}
      <Box
        sx={{
          width: '100%',
          height: '50px',
          marginTop: '20px',
          borderRadius: '100px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >

      </Box>

      {/* Карточки */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mt: 1.3,
          mb: 2,
          width: '100%',
        }}
      >
        {/* Карточка 'Постов' с SVG */}
        <Box
          sx={{
            width: '130px',
            height: '120px',
                          backgroundColor: 'rgba(34, 40, 47, 1)',

            borderRadius: 2,
            marginLeft: cards[0].ml,
            marginRight: cards[0].mr,
            position: 'relative',
            overflow: 'hidden',
            opacity: mounted ? 1 : 0,
      
          }}
        >
          {/*    <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%',marginTop:'8px' }}>
              <g clipPath="url(#clip0_798_214)">
                <g filter="url(#filter0_d_798_214)">
                  <path d="M9.01291 64.4L-0.628389 80.3284L-1.08519 110.063L128.349 112.051L129.41 42.9386L103.043 60.2177L97.9846 49.6902L93.7352 54.4479L90.6778 49.578L64.7832 70.0797L56.0959 57.8888L37.4711 80.9137L32.9467 69.5906L30.4112 64.7287L22.4591 72.6448L16.8416 64.5202L13.636 69.294L9.01291 64.4Z" fill="url(#paint0_linear_798_214)" shapeRendering="crispEdges"/>
                </g>
                <path d="M1.0007 76.8998L10.3697 63.4137L14.8867 67.5721L18.0028 63.5309L23.4957 70.4304L31.2334 63.7342L33.7149 67.8613L38.1482 77.4705L56.2622 57.9852L64.756 68.3382L89.9628 51.0063L92.9532 55.1413L97.087 51.1158L102.04 60.0514L129.507 44.9662" stroke="white" strokeWidth="2"/>
              </g>
              <defs>
                <filter id="filter0_d_798_214" x="-101.086" y="42.9386" width="330.496" height="469.113" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="300"/>
                  <feGaussianBlur stdDeviation="50"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_798_214"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_798_214" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_798_214" x1="63" y1="41.5" x2="60" y2="118" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F5F5F5"/>
                  <stop offset="1" stopColor="#262626" stopOpacity="0"/>
                </linearGradient>
                <clipPath id="clip0_798_214">
                  <rect width="120" height="120" rx="15" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </Box>*/}
       
          {/* Текст и число поверх SVG */}
          <Typography
            sx={{
              position: 'absolute',
              top: 14,
              left: 15,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              zIndex: 1,
            }}
          >
            {cards[0].label}
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 13,
              fontWeight: 'Bold',
              color: 'rgba(138, 135, 219, 1)',
              fontSize: '40px',
              zIndex: 1,
            }}
          >
            {cards[0].value}
          </Typography>
        </Box>
        {/* Остальные карточки первой строки */}
        {cards.slice(1, 2).map((card, idx) => (
          <Box
            key={card.label}
            sx={{
              width: '130px',
              height: '120px',
                            backgroundColor: 'rgba(34, 40, 47, 1)',

              backgroundColor: 'rgba(34, 40, 47, 1)',
              borderRadius: 2,
              marginLeft: card.ml,
              marginRight: card.mr,
              position: 'relative',
              opacity: mounted ? 1 : 0,
         
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: 14,
                left: 15,
              color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 13,
                fontWeight: 'Bold',
              color: 'rgba(197, 135, 219, 1)',
                fontSize: '40px',
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mt: 1.4,
          mb: 2,
          width: '100%',
        }}
      >
        {cards.slice(2, 4).map((card, idx) => (
          <Box
            key={card.label}
            onClick={card.label === 'Баланс' ? () => window.location.href = '/wallet' : undefined}
            sx={{
              width: '130px',
              height: '120px',
              backgroundColor: 'rgba(34, 40, 47, 1)',
              borderRadius: 2,
              marginLeft: card.ml,
              marginRight: card.mr,
              position: 'relative',
              opacity: mounted ? 1 : 0,
              cursor: card.label === 'Баланс' ? 'pointer' : undefined,
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: 14,
                left: 15,
              color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 13,
                fontWeight: 'Bold',
              color: 'rgba(219, 153, 135, 1)',
                fontSize: '40px',
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>
      


      {/* Уведомления */}
     {/* Уведомления */}
<Box
  sx={{
    width: '250px',
    minHeight: '200px',
    backgroundColor: 'rgba(34, 40, 47, 1)',
    borderRadius: 2,
    margin: '0 auto 0px auto',
    transition: 'box-shadow 0.4s, transform 0.4s, opacity 0.7s',
    position: 'relative',
    opacity: mounted ? 1 : 0,
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18, mb: 0, pt: 1.5, ml: 2 }}>Уведомления</Typography>
    <IconButton
      size="small"
      onClick={() => setNotificationsExpanded(v => !v)}
      sx={{
        mt: 1.5,
        color: '#333',
        transition: 'background 0.3s',
        '&:hover': { background: 'rgba(0,0,0,0.08)' }
      }}
    >
      {notificationsExpanded ? <ExpandLessIcon fontSize="medium" /> : <ExpandMoreIcon fontSize="medium" />}
    </IconButton>
  </Box>
  {noth === null ? (
    <Typography sx={{ 
      color: 'rgb(225,225,225)',
      fontWeight: 'bold', 
      fontSize: '14px',
      textAlign: 'center',
      py: 3,
      px: 2
    }}>
      Загрузка...
    </Typography>
  ) : Array.isArray(noth) && noth.length === 0 ? (
    <Typography sx={{ 
      color: 'rgb(225,225,225)',
      fontWeight: 'bold', 
      fontSize: '14px',
      textAlign: 'center',
      py: 3,
      px: 2
    }}>
      Нет уведомлений
    </Typography>
  ) : (
    <Box
      sx={{
        pr: 1,
        ml: 1,
        paddingTop: '10px',
        maxHeight: notificationsExpanded ? 1000 : 220,
        overflowY: notificationsExpanded ? 'visible' : 'auto',
        transition: 'max-height 0.5s cubic-bezier(.4,0,.2,1)',
        // Стили для скроллбара
        '&::-webkit-scrollbar': {
          width: '0px',  // Убираем скроллбар для Chrome/Safari
          height: '0px',
        },
        scrollbarWidth: 'none',  // Убираем скроллбар для Firefox
        '-ms-overflow-style': 'none',  // Убираем скроллбар для IE/Edge
      }}
    >
      {noth.map((n, idx) => (
        <Box key={idx} sx={{ mb: 1.5, p: 1.2, borderRadius: 2, background: 'rgba(43, 43, 43, 0.11)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'rgb(225,225,225)' }}>{n.title}</Typography>
          <Typography sx={{ color: 'rgba(203, 203, 203, 0.8)', fontSize: 13 }}>{n.description}</Typography>
          <Typography sx={{ color: 'rgba(146, 146, 146, 0.5)', fontSize: 11, mt: 0.5 }}>{n.date ? new Date(n.date).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
        </Box>
      ))}
    </Box>
  )}
</Box>
        {noth && Array.isArray(noth) && noth.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon sx={{ fontSize: 18 }} />}
            onClick={handleClearNotifications}
            sx={{
              marginTop:"10px",
              marginLeft:"160px",
              borderRadius: 2,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: 13,
              minWidth: 'auto',
              padding: '2px 10px',
              background: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,0,0,0.25)',
              boxShadow: 'none',
              opacity: 0.7,
              '&:hover': {
                background: 'rgba(255,0,0,0.08)',
                opacity: 1
              }
            }}
          >
            Очистить
          </Button>
        )}
   
    </Box>
  );
});

export default WidgetMain; 