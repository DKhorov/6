import React from 'react';
import { Box, Skeleton } from '@mui/material';

const PostSkeleton = () => (
  <Box
    sx={{
      width: '100%',
      minHeight: '150px',
      maxHeight: '550px',
      marginTop: '10px',
      borderRadius: '10px',
      backgroundColor: 'rgba(34, 40, 47, 1)',
      padding: '15px',
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={80} height={20} />
    </Box>
    <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 1, borderRadius: 2 }} />
    <Skeleton variant="text" width="60%" height={28} />
    <Skeleton variant="text" width="40%" height={18} />
  </Box>
);

export default PostSkeleton; 