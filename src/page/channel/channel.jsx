import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  CircularProgress
} from '@mui/material';
import axios from '../../system/axios';
import { useSelector } from 'react-redux';
import { selectPanelCurve } from '../../system/redux/slices/store';

// Список URL случайных аватаров
const AVATAR_URLS = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuK3y3nez-yblC8IHKexOh-BT090rLtUyDpjAWLfkjwN-G5HmiMvPGM8lXYerZ0OuyAbY&usqp=CAU',
  'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTcS9jr0n8i7LY1tL3U7AiafVhqsYbJ0zPqkVUQTfiJR.pW8nXYusSsJ.e3cK9InrTqhKz8Ra27qsnb5f2wFnRf3Q--&format=png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6sXOhX7Pqh-1tO-4CUL60DVOW7KHU_A9fqR2t9A9Ceg7shSqzOCeO7XIsLEioeGJ7Gr4&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbYyur0yvAR24obbOCvFCW8-bTT8CjyW3vRQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4KYd2_StlgfWNRgcvpqhsew7bGf2dZP1nrg&s'
];

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      marginRight: "20px",
      color: "rgba(236, 236, 236, 1)" 
    }}>
      {`${hours}:${minutes}`}
    </Typography>
  );
};

const Channel = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('/channels');
        
        // Обрабатываем разные форматы ответа
        let channelsData = [];
        if (Array.isArray(response.data)) {
          channelsData = response.data;
        } else if (response.data && Array.isArray(response.data.channels)) {
          channelsData = response.data.channels;
        } else if (response.data && Array.isArray(response.data.items)) {
          channelsData = response.data.items;
        } else if (response.data && typeof response.data === 'object') {
          channelsData = [response.data];
        }
        
        // Добавляем случайные аватары к каналам
        const channelsWithAvatars = (channelsData || []).map(channel => ({
          ...channel,
          randomAvatar: AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)]
        }));
        
        setChannels(channelsWithAvatars);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке каналов');
        setLoading(false);
        console.error('Ошибка при загрузке каналов:', err);
      }
    };

    fetchChannels();
  }, []);

  const getAvatarLetters = (name) => {
    if (!name) return 'CH';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100vw' : '450px',
        maxWidth: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? '100vh' : '100vh',
        flex: isMobile ? 1 : 'none',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0,
        px: 1.5,
        pt: isMobile ? 1 : 0,
        mt: isMobile ? 2 : 0,
      }}
    >
      {/* Header */}
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

      {/* Channel Info */}
      <Box
        sx={{
          width: '100%',
          marginTop: '10px',
                        backgroundColor: 'rgba(38, 44, 51, 1)',

          borderRadius: panelCurve === 'rounded' ? '12px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '12px',
          padding: '16px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: 'primary.main',
            fontSize: '1.25rem'
          }}
          src={AVATAR_URLS[0]}
        >
          CH
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1, mb: 0 , color:'rgba(255, 255, 255, 1)'
}}>
            Все каналы
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1, mt: 0.5 , color:'rgba(112, 112, 112, 1)'}}>
            {loading ? 'Загрузка...' : `Всего каналов: ${channels.length}`}
          </Typography>
        </Box>
      </Box>

      {/* Channels List */}
      <Box
        sx={{
          width: '100%',
          marginTop: '10px',
                        backgroundColor: 'rgba(38, 44, 51, 1)',

          borderRadius: panelCurve === 'rounded' ? '12px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '12px',
          padding: '16px',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' , color:'rgba(210, 210, 210, 1)'}}>
Просмотр каналов не доступен        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ py: 2 }}>
            Ошибка загрузки: {error}
          </Typography>
        ) : !Array.isArray(channels) || channels.length === 0 ? (
          <Typography sx={{ py: 2, color: 'text.secondary' }}>
            Каналы не найдены
          </Typography>
        ) : (
          <List sx={{ width: '100%',               backgroundColor: 'rgba(38, 44, 51, 1)',
 }}>
            {channels.map((channel, index) => {
              const channelId = channel._id || channel.id || index;
              const channelName = channel.name || channel.title || 'Без названия';
              const channelDescription = channel.description || 'Описание отсутствует';
              const membersCount = channel.membersCount || channel.members?.length || 0;
              const avatarUrl = channel.avatarUrl || channel.image || channel.cover || channel.randomAvatar;

              return (
                <React.Fragment key={channelId}>
                  <ListItem alignItems="flex-start" sx={{              backgroundColor: 'rgba(38, 44, 51, 1)',
}}>
                    <ListItemAvatar>
                      <Avatar 
                        alt={channelName} 
                        src={avatarUrl}
                        sx={{              backgroundColor: 'rgba(38, 44, 51, 1)',
 }}
                      >
                        {getAvatarLetters(channelName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={channelName}
                      sx={{color:'rgba(243, 243, 243, 1)'}}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="rgba(193, 193, 193, 1)"
                          >
                            {channelDescription}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="rgba(112, 112, 112, 1)"
                          >
                            Участников: {membersCount}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < channels.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Channel;