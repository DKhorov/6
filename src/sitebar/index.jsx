import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import logo from '../image/1.webp';
import { getRandomWord } from '../system/randomword';
import '../fonts/stylesheet.css';
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import PersonIcon from '@mui/icons-material/Person';
import { FiActivity } from "react-icons/fi";
import { FiServer } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import { FiCommand } from "react-icons/fi";
import { FiRadio } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiHardDrive } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const menuItems = [
  { label: 'Главная', icon: <HomeIcon /> },
  { label: 'Каналы', icon: <FiHardDrive /> },
  { label: 'Новости', icon: <FiRadio /> },
  { label: 'Профиль', icon: <PersonIcon /> },
  { label: 'Приложения', icon: <FiCommand /> },

];

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const menu = [
    { label: 'Главная', icon: <HomeIcon sx={{ fontSize: 28 }} />, path: '/' },
    { label: 'Apps', icon: <FiCommand size={26} />, path: '/miniApps' },
    { 
      label: 'Профиль', 
      icon: <PersonIcon sx={{ fontSize: 28 }} />, 
      path: user ? `/account/${user.id || user._id}` : '/' 
    },
    { label: 'Новости', icon: <FiRadio size={26} />, path: '/news' },
    { label: 'Настройки', icon: <FiSettings size={26} />, path: '/setting' },

  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '62px',
              backgroundColor: 'rgba(49, 56, 64, 1)',
        boxShadow: '0 -4px 24px 0 rgba(31,38,135,0.10)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 2000,
   
        px: 1,
      }}
    >
      {menu.map((item, idx) => {
        const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
        return (
          <Button
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              minWidth: 0,
              flex: 1,
              height: '100%',
              background: isActive ? 'rgba(49, 56, 64, 1)' : 'transparent',
              color: isActive ? '#ffffffff' : 'rgba(143, 142, 142, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              transition: 'background 0.2s, color 0.2s',
              boxShadow: 'none',
              mx: idx !== 0 ? 0.5 : 0,
              '&:hover': {
                color: '#1976d2',
              },
            }}
            disableRipple
          >
            {item.icon}
          </Button>
        );
      })}
    </Box>
  );
};

const Sitebar = () => {
  const [randomWord, setRandomWord] = useState(getRandomWord());
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();
  const boopRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:900px)');
  const user = useSelector(selectUser);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRandomWord(getRandomWord());
        setFade(true);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isMobile) {
    return <MobileMenu />;
  }

  return (
    <Box
      sx={{
        width: '250px',
        minWidth: '250px',
        height: '600px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '50px',
          marginTop: '20px',
          borderRadius: '5 0 0 100px',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{
            height: '45px',
            width: '45px',
            marginLeft: '5px',
          }}
        />
      </Box>
      
      <Box
        sx={{
          marginTop: '5px',
        }}
      >
        {menuItems.map((item, index) => (
          <Button
            key={index}
            startIcon={item.icon}
            sx={{
              width: '100%',
              height: '35px',
              marginTop: '5px',
              borderRadius: '5px',
              backgroundColor: 'rgba(38, 44, 51, 1)',
              color: 'rgba(202, 202, 202, 1)',
              textAlign: 'left',
              fontWeight: 'bold',
              textTransform: 'none',
              justifyContent: 'flex-start',
              pl: 2,
              transition: 'box-shadow 0.3s, transform 0.3s',
              '& .MuiButton-startIcon': {
                color: 'rgb(150, 149, 154)',
              },
              '&:hover': {
                backgroundColor: '#828181ff',
              },
            }}
            onClick={() => {
              if (item.label === 'Музыка') {
                navigate('/music');
              }
              if (item.label === 'Главная') {
                navigate('/');
              }
              if (item.label === 'Новости') {
                navigate('/news');
              }
              if (item.label === 'Профиль') {
                if (user && (user.id || user._id)) {
                  navigate(`/account/${user.id || user._id}`);
                } else {
                  alert('Перезагрузи сайт два раза сначала')
                }
              }
              if (item.label === 'Группы') {
                navigate('/group');
              }
                 if (item.label === 'Приложения') {
                navigate('/miniApps');
              }
                if (item.label === 'Каналы') {
                navigate('/channel');
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      
      <Box
        sx={{
          width: '100%',
          height: '105px',
          marginTop: '10px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgb(0, 0, 0), rgba(6, 62, 152, 1))',
          color: 'white',
          textAlign: 'left',
          padding: '5px',
        }}
      >
        <Typography
          sx={{
            marginTop: '10px',
            marginLeft: '10px',
            fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
            fontWeight: 700,
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          {randomWord}
        </Typography>
      </Box>
    </Box>
  );
};

export default Sitebar;