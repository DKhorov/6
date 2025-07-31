import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const ANIMATION_STEP = 120; // задержка между карточками (мс)
const ITEM_HEIGHT = 60; // высота карточки трека

const MusicItems = React.memo(({ tracks }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [visible, setVisible] = useState(Array(tracks.length).fill(false));

  useEffect(() => {
    setVisible(Array(tracks.length).fill(false));
    tracks.forEach((_, idx) => {
      setTimeout(() => {
        setVisible(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, idx * ANIMATION_STEP);
    });
  }, [tracks]);

  const getCoverImage = (cover) => {
    if (!cover) return "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
    if (/^https?:\/\//.test(cover)) return cover;
    // иначе — старый вариант
    const cleanPath = cover.replace(/^\/?uploads\/?/, '').replace(/^\/?music\/?/, '');
    return `https://atomglidedev.ru/uploads/music/${cleanPath}?v=${new Date().getTime()}`;
  };

  // Виртуализированный рендер трека
  const renderRow = useCallback(({ index, style }) => {
    const track = tracks[index];
    if (!track) return null;
    return (
      <Box
        key={track.id || index}
        style={style}
        sx={{
          width: '100%',
          height: '55px',
          marginTop: index === 0 ? '10px' : '10px',
          borderRadius: '5px',
          backgroundColor: 'rgb(255, 255, 255)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: visible[index] ? '0 2px 12px 0 rgba(0,0,0,0.04)' : 'none',
          opacity: visible[index] ? 1 : 0,
          transform: visible[index] ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)',
          transitionDelay: `${index * ANIMATION_STEP}ms`,
        }}
      >
        {/* Левая часть: обложка и название */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <img
            src={getCoverImage(track.cover)}
            alt="side-cover"
            loading="lazy"
            style={{
              height: '40px',
              width: '40px',
              marginLeft: '15px',
              objectFit: 'cover',
              borderRadius: '5px',
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Yandex Sans"',
              fontWeight: 400,
              fontSize: isMobile ? '0.78rem' : '0.9rem',
              marginLeft: '14px',
              color: '#222',
              maxWidth: isMobile ? '90px' : '180px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {track.title}
          </Typography>
        </Box>
        {/* Правая часть: автор и play */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '18px', minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"Yandex Sans"',
              fontWeight: 400,
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              color: '#888',
              maxWidth: isMobile ? '60px' : '120px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {track.artist}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', pl: 1 }}>
            {/* Play icon */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="11" fill="#bbb"/>
              <polygon points="9,7 16,11 9,15" fill="white" />
            </svg>
          </Box>
        </Box>
      </Box>
    );
  }, [tracks, visible, isMobile]);

  if (!tracks.length) {
    return <Typography sx={{ mt: 4, color: '#888', textAlign: 'center' }}>Нет треков для отображения</Typography>;
  }

  return (
    <List
      height={Math.min(tracks.length, 8) * ITEM_HEIGHT + 10}
      itemCount={tracks.length}
      itemSize={ITEM_HEIGHT}
      width={"100%"}
    >
      {renderRow}
    </List>
  );
});

export default MusicItems; 