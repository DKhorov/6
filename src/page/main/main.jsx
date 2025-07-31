
import PostCreator from './PostCreator';
import PostsList from './PostsList';
import Group8 from '../../image/Group8.png';
import axios from '../../system/axios';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { selectPanelCurve } from '../../system/redux/slices/store';
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
      fontFamily: "'Yandex Sans'",
      fontWeight: "Light",
      marginRight:"20px",
       color:"rgba(226, 226, 226, 1)" }}>
      {`${hours}:${minutes}`}
    </Typography>
  );
};

const Main = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

// Функция для обновления поста после лайка/дизлайка

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Оптимистичное добавление поста
  const handlePostCreated = async (postData) => {
    const tempId = 'temp-' + Date.now();
    const optimisticPost = { ...postData, _id: tempId, pending: true };
    setPosts(prev => [optimisticPost, ...prev]);
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      if (postData.image) formData.append('image', postData.image);
      const token = localStorage.getItem('token');
      const res = await fetch('https://atomglidedev.ru/posts', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      const createdPost = await res.json();
      setPosts(prev => prev.map(p => (p._id === tempId ? { ...createdPost, pending: false } : p)));
      // --- Обновить уведомления ---
      window.dispatchEvent(new Event('refresh-notifications'));
      // --- Явно создать уведомление через API ---
      try {
        await axios.post('/notifications', {
          title: 'Пост создан',
          description: `Ваш пост "${createdPost.title}" успешно опубликован.`
        });
        window.dispatchEvent(new Event('refresh-notifications'));
      } catch {}
    } catch (e) {
      setPosts(prev => prev.filter(p => p._id !== tempId));
    }
  };

  // Удаление поста
  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };
const handlePostUpdate = (updatedPost) => {
  setPosts(prevPosts => 
    prevPosts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    )
  );
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
        pl: 1.5, // <-- убран паддинг по бокам
                pr: 1.5, // <-- убран паддинг по бокам

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
      
      <PostCreator onPostCreated={handlePostCreated} />
      <PostsList posts={posts} loading={loading} onDelete={handleDeletePost}   onPostUpdate={handlePostUpdate}  // Передаем колбэк
 />
    </Box>
  );
};

export default Main;
