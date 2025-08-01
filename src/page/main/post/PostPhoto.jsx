import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Modal, Typography, Avatar } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';

const PostPhoto = ({ post, isLCP = false, postIndex = 0 }) => {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [open, setOpen] = useState(false);
  const imgRef = useRef(null);

  // Проверяем наличие imageUrl ДО всех хуков
  const hasImage = Boolean(post?.imageUrl);
  const shouldLoadEagerly = postIndex < 10;

  // Формируем imageUrl (вернет undefined если нет изображения)
  const imageUrl = hasImage
    ? post.imageUrl.startsWith('http')
      ? post.imageUrl
      : `https://atomglidedev.ru${post.imageUrl}`
    : undefined;

  useEffect(() => {
    if (!hasImage) return; // Выходим если нет изображения
    const img = imgRef.current;
    if (img && img.complete) {
      setIsHorizontal(img.naturalWidth > img.naturalHeight);
      setImageLoaded(true);
    }
  }, [imageUrl, hasImage]);

  const handleImgLoad = (e) => {
    const img = e.target;
    setIsHorizontal(img.naturalWidth > img.naturalHeight);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImgError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Если нет изображения - возвращаем null ПОСЛЕ всех хуков
  if (!hasImage) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          marginTop: '5px',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0',
          borderRadius: '5px',
          position: 'relative',
          backgroundColor: 'rgb(78, 78, 78)',
          cursor: 'pointer',
        }}
        onClick={handleOpen}
      >
        {/* Placeholder пока изображение загружается */}
        {!imageLoaded && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}

        {/* Fallback при ошибке */}
        {imageError && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 300,
              backgroundColor: 'rgb(236, 236, 236)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: 14,
            }}
          >
            Изображение недоступно
          </Box>
        )}

        <img
          ref={imgRef}
          src={imageUrl}
          alt="post"
          style={{
            width: '80%',
            height: 'auto',
            maxWidth: 400,
            maxHeight: 300,
            objectFit: 'contain',
            transition: 'opacity 0.3s',
            opacity: imageLoaded && !imageError ? 1 : 0,
            display: imageLoaded && !imageError ? 'block' : 'none',
            margin: '0 auto',
          }}
          onLoad={handleImgLoad}
          onError={handleImgError}
          {...(shouldLoadEagerly ? { 
            loading: 'eager',
            fetchPriority: postIndex < 3 ? 'high' : 'auto'
          } : { 
            loading: 'lazy',
            decoding: 'async'
          })}
        />

        {imageLoaded && !imageError && (
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
          >
            <ZoomInIcon />
          </IconButton>
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {post?.author?.avatar && (
              <Avatar
                src={post.author.avatar.startsWith('http') 
                  ? post.author.avatar 
                  : `https://atomglidedev.ru${post.author.avatar}`}
                sx={{ width: 40, height: 40, marginRight: 2 }}
              />
            )}
            <Typography variant="h6" color="gray">
              {post?.author?.name || 'AtomGlide Post'}
            </Typography>
            <IconButton
              sx={{
                marginLeft: 'auto',
                color: 'white',
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              overflow: 'hidden',
            }}
          >
            <img
              src={imageUrl}
              alt="post"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PostPhoto;


