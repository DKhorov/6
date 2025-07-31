import { Box, Typography, useMediaQuery, Avatar, CircularProgress, Button } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPanelCurve } from '../../system/redux/slices/store';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../system/axios';
import '../../fonts/stylesheet.css';
import PostHeader from '../main/post/PostHeader';
import PostPhoto from '../main/post/PostPhoto';

const Fullpost = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://atomglidedev.ru/posts/${id}`);
        
        if (response.data) {
          setPost({
            ...response.data,
            // Приводим данные к ожидаемому формату
            author: response.data.user, // переименовываем user в author
            imageUrl: response.data.imageUrl,
            title: response.data.title,
            _id: response.data._id,
            createdAt: response.data.createdAt
          });
        } else {
          setError('Пост не найден');
        }
      } catch (err) {
        console.error('Ошибка при загрузке поста:', err);
        setError(err.response?.data?.message || 'Ошибка при загрузке поста');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Остальной код компонента остается без изменений
  if (loading) {
    return (
      <Box sx={{
        width: isMobile ? '100vw' : '450px',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(14, 17, 22, 1)'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{
        width: isMobile ? '100vw' : '450px',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(14, 17, 22, 1)',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        color: 'white'
      }}>
        <Typography variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: 'rgba(56, 64, 73, 1)',
            '&:hover': {
              backgroundColor: 'rgba(56, 64, 73, 0.8)',
            }
          }}
        >
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
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
      backgroundColor: 'rgba(14, 17, 22, 1)'
    }}>
      {/* Шапка */}
      <Box sx={{
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
      }}>
        <Typography sx={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Arial'",
          fontWeight: "Bold",
          marginLeft: "20px",
          color: "rgba(226, 226, 226, 1)"
        }}>
          AtomGlide
        </Typography>
        <Typography sx={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Arial'",
          fontWeight: "Bold",
          marginRight: "20px",
          color: "rgba(226, 226, 226, 1)"
        }}>
          Post
        </Typography>
      </Box>

      {/* Контент поста */}
      <Box sx={{ p: 2 }}>
        <PostHeader post={post} />
        
        {post.imageUrl && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <PostPhoto post={post} />
          </Box>
        )}

        <Typography sx={{
          color: 'white',
          fontSize: '16px',
          mt: 2,
          whiteSpace: 'pre-line'
        }}>
          {post.title || 'Нет текста'}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{
            fontSize: '10px',
            color: 'rgb(120,120,120)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Оригинальный пост из сайта atomglide.com
          </Typography>
          
  
        </Box>
      </Box>
    </Box>
  );
};

export default Fullpost;