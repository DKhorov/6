import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ai from '../../image/ai.png';
import wiki from '../../image/wiki.png';
import set from '../../image/set.png';
import gal from '../../image/gal.png';

import Group2 from '../../image/Group2.png';
import axios from '../../system/axios';
import { useSelector } from 'react-redux';
import { selectPanelCurve } from '../../system/redux/slices/store';

const cubeData = [
  { id: 1, image: ai, title: 'Chat AI', subtitle: 'Провайдер: OpenAI' },
  { id: 2, image: wiki, title: 'AtomWiki', subtitle: 'Провайдер: AtomGlide' },
  { id: 3, image: Group2, title: 'Wallet', subtitle: 'Провайдер: AtomGlide' },
  { id: 4, image: set, title: 'Настройки', subtitle: 'Провайдер: AtomGlide' },
    { id: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4KYd2_StlgfWNRgcvpqhsew7bGf2dZP1nrg&s', title: 'Mineraft Online', subtitle: 'Провайдер: classic.minecraft.net' },

];

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return (
    <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: "Light", marginRight:"20px", color:"rgba(183, 183, 183, 1)" }}>
      {`${hours}:${minutes}`}
    </Typography>
  );
};

const Apps = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);
  const navigate = useNavigate();

  const handleCubeClick = (id) => {
    switch (id) {
      case 1:
        navigate('/ai');
        break;
      case 2:
        window.open('https://atomglide.com/atomwiki.html', '_blank');
        break;
      case 3:
        navigate('/wallet');
        break;
      case 4:
        navigate('/setting');
        break;
          case 6:
        window.open('https://classic.minecraft.net', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100vw' : '450px',
        maxWidth: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: isMobile ? 1 : 'none',
        overflowY: 'auto',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none', 
         ml: isMobile ? '20px' : '0', // 👈 Условный отступ
        mr: isMobile ? '20px' : '0', // 👈 Условный отступ
        '&::-webkit-scrollbar': { width: '0px', background: 'transparent' },
        paddingBottom: isMobile ? '70px' : 0, 
        px: 0,
        pt: isMobile ? 1 : 0,
        mt: isMobile ? 2 : 0, 
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2,   ml: isMobile ? '20px' : '10px', // 👈 Условный отступ
        mr: isMobile ? '20px' : '10px', // 👈 Условный отступ
    mt: isMobile ? '10px' : '10px', // 👈 Условный отступ
}}>
        {cubeData.map(({ id, image, title, subtitle }) => (
          <Box
            key={id}
            onClick={() => handleCubeClick(id)}
            sx={{
              width: isMobile ? '100%' : 'calc(50% - 8px)',
              height: '200px',
              cursor: 'pointer',
              borderRadius: panelCurve === 'rounded' ? '20px' :
                            panelCurve === 'sharp' ? '0px' :
                            panelCurve === 'pill' ? '25px' : '20px',
                   backgroundColor: 'rgba(44, 51, 58, 1)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 1, mt: 1 }}>
              <img src={image} width="70px" height="70px" alt={title} />
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '15px',color:'rgba(224, 224, 224, 1)' }}>{title}</Typography>
              <Typography sx={{ fontSize: '12px', color: 'gray', mt: 0 ,color:'rgba(182, 181, 181, 1)'}}>{subtitle}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Apps;
