import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { customIcons } from '../../../components/icon';

const PostText = ({ children, postId }) => {
  const navigate = useNavigate();

  const renderContent = (content) => {
    if (typeof content === 'string') {
      // Разбиваем текст на части, сохраняя [keywords]
      return content.split(/(\[[^\]]+\])/).map((part, index) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          const keyword = part.slice(1, -1).toLowerCase();
          const IconComponent = customIcons[keyword]?.component;
          
          return IconComponent 
            ? <IconComponent key={`icon-${index}`} style={{ 
                display: 'inline-flex',
                verticalAlign: 'middle',
                margin: '0 2px'
              }} /> 
            : part;
        }
        return part;
      });
    }
    return content;
  };

  const handleClick = () => postId && navigate(`/post/${postId}`);

  return (
    <Typography 
      sx={{ 
        fontFamily: 'Arial',
        marginTop: '10px', 
        marginLeft: '10px',
        color: 'white',
        cursor: postId ? 'pointer' : 'default',
        '&:hover': {
          textDecoration: postId ? 'underline' : 'none'
        }
      }}
      onClick={handleClick}
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) ? child : renderContent(child)
      )}
    </Typography>
  );
};

export default PostText;