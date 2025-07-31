import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../../fonts/stylesheet.css';
import { customIcons } from '../../../components/icon';

const PostText = ({ children, postId }) => {
  const navigate = useNavigate();
  let childText = '';

  if (typeof children === 'string') {
    childText = children;
  } else if (Array.isArray(children)) {
    childText = children.join('');
  } else if (typeof children === 'object' && 'props' in children) {
    childText = children.props.children;
  } else {
    childText = String(children);
  }

  const parseTextWithIcons = (text) => {
    const parts = text.split(/(\[[^\]]+\])/);
    
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const keyword = part.slice(1, -1);
        const iconData = customIcons[keyword];
        
        if (iconData) {
          const IconComponent = iconData.component;
          return <IconComponent key={index} />;
        }
      }
      return part;
    });
  };

  const handleClick = () => {
    if (postId) {
      navigate(`/post/${postId}`);
    }
  };

  return (
    <Typography 
      sx={{ 
        fontFamily: 'Arial',
        marginTop: '10px', 
        marginLeft: '10px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        cursor: postId ? 'pointer' : 'default',
        '&:hover': {
          textDecoration: postId ? 'underline' : 'none'
        }
      }}
      onClick={handleClick}
    >
      {parseTextWithIcons(childText)}
    </Typography>
  );
};

export default PostText;