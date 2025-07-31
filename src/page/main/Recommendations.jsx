import React, { useState, useEffect } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import PostHeader from './post/PostHeader';
import PostPhoto from './post/PostPhoto';
import PostText from './post/PostText';
import axios from '../../system/axios';
import PostCreator from './PostCreator';
import PostSkeleton from './post/PostSkeleton';

const PAGE_SIZE = 10;
const ANIMATION_STEP = 100;

const getDateString = (date) => {
  const d = date ? new Date(date) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Recommendations = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/posts?offset=0&limit=100').then(res => {
      const arr = Array.isArray(res.data) ? res.data : [];
      const shuffled = shuffleArray(arr);
      setAllPosts(shuffled);
      setPosts(shuffled.slice(0, PAGE_SIZE));
      setIndex(PAGE_SIZE);
      setHasMore(shuffled.length > PAGE_SIZE);
      setVisible(Array(Math.min(PAGE_SIZE, shuffled.length)).fill(false));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setHasMore(false);
    });
  }, []);

  useEffect(() => {
    setVisible(Array(posts.length).fill(false));
    posts.forEach((_, idx) => {
      setTimeout(() => {
        setVisible(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, idx * ANIMATION_STEP);
    });
  }, [posts]);

  const handleLoadMore = () => {
    const nextIdx = index + PAGE_SIZE;
    setPosts(allPosts.slice(0, nextIdx));
    setIndex(nextIdx);
    setHasMore(nextIdx < allPosts.length);
    setVisible(Array(Math.min(nextIdx, allPosts.length)).fill(false));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* <PostCreator />  // Удаляем, теперь он в layout */}
      <Box sx={{ fontWeight: 700, fontSize: 28, mt: 2, mb: 2, color: '#9147ff' }}>Рекомендации</Box>
      {posts.map((post, index) => (
        <Box
          key={post._id || index}
          sx={{
            width: '100%',
            minHeight: '150px',
            maxHeight: '550px',
            marginTop: '10px',
            borderRadius: '10px',
            backgroundColor: 'rgb(255, 255, 255)',
            padding: '15px',
            boxShadow: visible[index] ? '0 2px 12px 0 rgba(0,0,0,0.04)' : 'none',
            opacity: visible[index] ? 1 : 0,
            transform: visible[index] ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)',
            transitionDelay: `${index * ANIMATION_STEP}ms`,
          }}
        >
          <PostHeader index={index} post={post} />
          <PostPhoto post={post} />
          <PostText>{post.title || 'Привет мир как тебя зовут все хорошо'}</PostText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'rgb(150,150,150)', marginTop: '5px', px: '2px' }}>
            <span style={{marginLeft:"10px"}}>{getDateString(post.createdAt)}</span>
            <span style={{ fontWeight: 500 }}>atomglide post</span>
          </Box>
        </Box>
      ))}
      {loading && Array.from({ length: PAGE_SIZE }).map((_, idx) => <PostSkeleton key={idx} />)}
      {hasMore && !loading && (
        <Button
          onClick={handleLoadMore}
          variant="contained"
          sx={{
            mt: 3,
            mx: 'auto',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '15px',
            background: 'linear-gradient(90deg, #9147ff 0%, #772ce8 100%)',
            color: 'white',
            px: 4,
            py: 1.5,
            boxShadow: '0 2px 12px 0 rgba(145,71,255,0.10)',
            display: 'block',
            transition: 'background 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #772ce8 0%, #9147ff 100%)',
            },
          }}
        >
          Загрузить ещё
        </Button>
      )}
    </Box>
  );
};

export default Recommendations; 