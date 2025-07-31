import React, { memo } from 'react';
import { Box, Skeleton } from '@mui/material';
import PostHeader from './post/PostHeader';
import PostPhoto from './post/PostPhoto';
import PostText from './post/PostText';
import { getDateString } from '../../system/data';

const PostSkeleton = () => (
  <Box sx={{ 
    backgroundColor: 'rgba(34, 40, 47, 1)',
    borderRadius: 2, 
    p: 2, 
    mb: 2, 
    position: 'relative',
    minHeight: 400
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ ml: 2, flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Box>
    <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1, mb: 2 }} />
    <Skeleton variant="text" width="90%" height={24} />
    <Skeleton variant="text" width="70%" height={16} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Skeleton variant="text" width="30%" height={14} />
      <Skeleton variant="text" width="20%" height={14} />
    </Box>
  </Box>
);

const PostsList = memo(({ posts, loading, onDelete, onPostUpdate }) => {
  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {posts.map((post, index) => (
        <Box
          key={post._id || index}
          sx={{
            backgroundColor: 'rgba(34, 40, 47, 1)',
            borderRadius: 2,
            mb: 1,
            mt: 1,
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            p: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <PostHeader 
            post={post} 
            onDelete={onDelete} 
            onPostUpdate={onPostUpdate}
          />

          <PostPhoto post={post} isLCP={index === 0} postIndex={index} />
          <PostText postId={post._id}>
            {post.title || 'Этот пост не имеет текст :/'}
          </PostText>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '10px', 
            color: 'rgb(150,150,150)', 
            marginTop: '5px', 
            px: '2px' 
          }}>
            <span style={{marginLeft:"10px"}}>{getDateString(post.createdAt)}</span>
            <span style={{ fontWeight: 500 }}>atomglide post</span>
          </Box>
          {post.pending && (
            <Box sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 20, 
              color: 'orange', 
              fontSize: 13 
            }}>
              Отправляется...
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
});

export default PostsList;