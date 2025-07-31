import React, { Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, Typography } from '@mui/material';
import Sitebar from '../sitebar';
import Apps from '../page/apps';
import MobileSettings from '../widget/setting.jsx';

import Widget from '../widget';
import WidgetMain from '../widget/widget';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import Main from '../page/main/main';
import Wallet from '../page/wallet';
import Profile from '../page/profile/Profile';
import Notepad from '../page/notepad/index.jsx';
import { Settings } from '@mui/icons-material';
import Fullpost from '../page/fullPost/fullpost.jsx';

const MusicPage = React.lazy(() => import('../page/music'));
const Channel = React.lazy(() => import('../page/channel/channel.jsx'));

const NewsPage = React.lazy(() => import('../page/news'));
const Group = React.lazy(() => import('../page/group'));
const LoginPage = React.lazy(() => import('../page/login'));
const RegistrationPage = React.lazy(() => import('../page/registration'));
const NotFound = React.lazy(() => import('../page/profile/NotFound'));
const AIPage = React.lazy(() => import('../page/ai'));

const AppRouter = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  const user = useSelector(selectUser);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/registration';

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: isMobile ? 'stretch' : 'flex-start',
        alignContent: 'flex-start',
        width: '100%',
        minHeight: isMobile ? '100dvh' : '100vh',
        overflow: 'auto',
        flexDirection: isMobile ? 'column' : 'row',
        position: 'relative',
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/login"
            element={
              <Box
                sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}
              >
                <LoginPage />
              </Box>
            }
          />
          <Route
            path="/registration"
            element={
              <Box
                sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}
              >
                <RegistrationPage />
              </Box>
            }
          />
        </Routes>

        {!isAuthPage && (
          <>
            <Box sx={{ mr: 2 }}>
              <Sitebar />
            </Box>
            <Routes>
              <Route path="/notepad" element={<div style={{ display: 'flex' }}><Notepad /></div>} />
              <Route path="/" element={<div style={{ display: 'flex' }}><Main />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/news" element={<div style={{ display: 'flex' }}><NewsPage />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/group" element={<div style={{ display: 'flex' }}><Group />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/post/:id" element={<div style={{ display: 'flex' }}><Fullpost />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/setting" element={<div style={{ display: 'flex' }}><MobileSettings />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/channel" element={<div style={{ display: 'flex' }}><Channel />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/miniApps" element={<div style={{ display: 'flex' }}><Apps />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/wallet" element={<div style={{ display: 'flex' }}><Wallet />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/account" element={
                user && (user.id || user._id)
                  ? <Navigate to={`/account/${user.id || user._id}`} replace />
                  : <Box sx={{
                      width: '100%',
                      height: '50px',
                      marginTop: isMobile ? '10px' : '20px',
                      borderRadius: '100px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: isMobile ? 2 : 0,
                      position: 'relative',
                    }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.3)',
                      zIndex: 1,
                      borderRadius: '100px',
                    }} />
                    <Typography sx={{
                      position: 'relative',
                      zIndex: 2,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: "Bold",
                      marginLeft: "20px",
                      color: "white"
                    }}>
                      AtomGlide
                    </Typography>
                  </Box>
              } />
              <Route path="/account/:id" element={<div style={{ display: 'flex' }}><Profile />{!isMobile && <Widget />}</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </Suspense>
    </Box>
  );
};

export default AppRouter;