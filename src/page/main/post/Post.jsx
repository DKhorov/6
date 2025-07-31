import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PostHeader from './PostHeader';
import axios from '../../../system/axios';
import axios from '../axios';

const Post = ({ post, onDelete }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);

  // Определяем текущую реакцию пользователя
  const getCurrentReaction = () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !post) return null;
    
    if (post.likes?.users?.includes(userId)) return 'like';
    if (post.dislikes?.users?.includes(userId)) return 'dislike';
    return null;
  };

  // Обработчик лайка
const handleLike = async (postId) => {
      console.log("1")

  try {
    console.log("1")
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:3003/posts/${postId}/like`,
      {}, // пустое тело запроса
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Лайк успешен:', response.data);
  } catch (error) {
    console.error('Ошибка:', error.response?.data);
  }
};

  // Обработчик дизлайка
  const handleDislike = async (postId) => {
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const response = await axios.post(`http://localhost:3003/posts/${postId}/dislike`);
      setCurrentReaction(getCurrentReaction());
    } catch (error) {
      console.error('Ошибка при дизлайке:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      mb: 0, 
      borderRadius: 2, 
      bgcolor:                       'rgba(34, 40, 47, 1)',

      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
    }}>
      <PostHeader
        post={post}
        onDelete={onDelete}
        onLike={handleLike}
        onDislike={handleDislike}
        isLiking={isLiking}
          onPostUpdate={(updatedPost) => {
            // Обновляем состояние поста
            setPost(updatedPost);
          }}
        currentUserReaction={currentReaction || getCurrentReaction()}
      />
      
      {post.imageUrl && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            style={{ 
              width: '100%', 
              borderRadius: 8,
              maxHeight: 400,
              objectFit: 'cover'
            }} 
          />
        </Box>
      )}
      
      <Typography variant="body1" sx={{ mt: 1 }}>
        {post.title}
      </Typography>
    </Box>
  );
};

export default Post;