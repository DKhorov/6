import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useMediaQuery, TextField, IconButton, Button, Paper, Modal } from '@mui/material';
import { fontFamily } from '../../system/font';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import axios from '../../system/axios';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ForumIcon from '@mui/icons-material/Forum';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { selectPanelCurve } from '../../system/redux/slices/store';
import { useSelector } from 'react-redux';

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return (
    <Typography sx={{ 
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "Light",
      marginRight:"20px",
      color:"rgb(28, 28, 28)" }}>
      {` ${hours}:${minutes}`}
    </Typography>
  );
};

const MOCK_GPT_RESPONSE = (text) => `**GPT-4:**

Вы написали: \
${text}

_Это пример markdown-ответа._`;

const MAX_REQUESTS = 10;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 минут

const AI = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [messages, setMessages] = useState([
    { role: 'gpt', content: 'Привет! Я GPT-4. Задай мне любой вопрос.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [blockUntil, setBlockUntil] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const panelCurve = useSelector(selectPanelCurve);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Проверка блокировки при монтировании и при каждом запросе
  useEffect(() => {
    const savedBlock = localStorage.getItem('ai_block_until');
    if (savedBlock && Number(savedBlock) > Date.now()) {
      setBlockUntil(Number(savedBlock));
    }
  }, []);

  useEffect(() => {
    if (blockUntil && Date.now() < blockUntil) setModalOpen(true);
  }, [blockUntil]);

  const handleSend = async () => {
    if (!input.trim() || loading || requestCount >= MAX_REQUESTS || blockUntil) return;
    setLoading(true);
    setError('');
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setRequestCount((c) => {
      const next = c + 1;
      if (next >= MAX_REQUESTS) {
        const until = Date.now() + BLOCK_TIME_MS;
        setBlockUntil(until);
        localStorage.setItem('ai_block_until', until);
      }
      return next;
    });
    // --- Реальный запрос к backend ---
    try {
      const res = await axios.post('/api/chat', {
        message: userMsg.content,
        conversationHistory: conversationHistory.map(m => ({
          role: m.role === 'gpt' ? 'assistant' : m.role,
          content: m.content
        }))
      });
      if (res.data && res.data.success) {
        const gptMsg = { role: 'gpt', content: res.data.message };
        setMessages((prev) => [...prev, gptMsg]);
        setConversationHistory((prev) => [...prev, userMsg, gptMsg]);
      } else {
        let errMsg = res.data?.message || 'Ошибка ответа от AI';
        if (res.data?.error) errMsg += `\n${res.data.error}`;
        setError(errMsg);
      }
    } catch (err) {
      let errMsg = err.response?.data?.message || err.message || 'Ошибка при обращении к AI';
      if (err.response?.data?.error) errMsg += `\n${err.response.data.error}`;
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Последний ответ GPT для верхней плашки
  const lastGptMsg = [...messages].reverse().find((m) => m.role === 'gpt');

  return (
    <Box
      sx={{
        width: isMobile ? '100vw' : '450px',
        maxWidth: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: isMobile ? 1 : 'none',
        overflow: 'hidden',
        display: 'flex',
          ml: isMobile ? '10px' : '0', // 👈 Условный отступ
        mr: isMobile ? '10px' : '0', // 👈 Условный отступ
        flexDirection: 'column',
        fontFamily,
      }}
    >
      {/* Верхняя плашка */}
     <Box
                  sx={{
                    width: '100%',
                    height: '50px',
                    marginTop: isMobile ? '0' : '20px',
                    borderRadius: panelCurve === 'rounded' ? '100px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '100px',
                        backgroundColor: 'rgba(56, 64, 73, 1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: isMobile ? 2 : 0,
                    position: 'relative',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      zIndex: 1,
                      borderRadius: '100px',
                    }}
                  />
                  <Typography sx={{
                    position: 'relative',
                    zIndex: 2,
                          fontFamily: "'Arial'",
                    fontWeight: "Bold", marginLeft:"20px", color:"rgba(226, 226, 226, 1)"
                  }}>
                    AtomGlide
                  </Typography>
                      <Typography sx={{
                    position: 'relative',
                    zIndex: 2,
                          fontFamily: "'Arial'",
                    fontWeight: "Bold", marginRight:"20px", color:"rgba(203, 201, 201, 1)"
                  }}>
                    GPT-4
                  </Typography>
                </Box>

      {/* Последний ответ GPT */}
   

      {/* Счётчик запросов */}
      <Box sx={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        color: '#888',
        textAlign: 'right',
        px: isMobile ? 2 : 3,
        pt: 1,
      }}>
        {blockUntil && Date.now() < blockUntil
          ? `Лимит. Доступ через ${Math.ceil((blockUntil - Date.now()) / 60000)} мин.`
          : `Запросов: ${requestCount} / ${MAX_REQUESTS}`}
      </Box>

      {/* Список сообщений */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: isMobile ? 1 : 2,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                     backgroundColor: 'rgba(81, 91, 103, 1)',

              color: 'white',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              margin: '6px 0',
              padding: '10px 14px',
              maxWidth: '90%',
              fontFamily,
              fontSize: 15,
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
            }}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </Box>
        ))}
        {loading && (
          <Box sx={{ alignSelf: 'flex-start', color: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 15, pl: 1, py: 1 }}>
            <span className="blinking-cursor">GPT печатает...</span>
          </Box>
        )}
        {error && (
          <Box sx={{ color: 'red', fontFamily, fontSize: 14, mt: 1 }}>{error}</Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Инпут для ввода */}
      <Box
        sx={{
          width: '100%',
          background: 'rgba(86, 101, 116, 1)',
          padding: isMobile ? '8px 6px' : '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          position: 'sticky',
          bottom: 0,
          borderRadius: isMobile ? '0px' : '100px',

          marginBottom:"40px",
          zIndex: 10,
        }}
      >
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={loading ? 'Ждите ответа...' : 'Введите сообщение...'}
          disabled={loading || requestCount >= MAX_REQUESTS || !!blockUntil}
          multiline
          minRows={1}
          maxRows={4}
          fullWidth
          variant="outlined"
          sx={{
            fontFamily,
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              fontFamily,
              fontSize: 19, // увеличиваем размер текста
              padding: '5px 10px',
              '& fieldset': {
                border: 'none', // убираем бордер
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !input.trim() || requestCount >= MAX_REQUESTS || !!blockUntil}
          sx={{ ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
      {/* Модальное окно лимита */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} disableEscapeKeyDown>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            minWidth: isMobile ? '80vw' : 340,
            textAlign: 'center',
            pt: 5,
            fontFamily,
            outline: 'none',
            boxShadow: 'none',
          }}
          tabIndex={-1}
        >
          {/* Крестик в кружочке (macOS style) */}
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              bgcolor: '#f2f2f2',
              borderRadius: '50%',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)',
              '&:hover': { bgcolor: '#e0e0e0' },
              zIndex: 10,
              outline: 'none !important',
              boxShadow: 'none !important',
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontFamily, fontWeight: 700, fontSize: 20, mb: 2 }}>
            Лимит исчерпан
          </Typography>
          <Typography sx={{ fontFamily, fontSize: 16, mb: 3 }}>
            Или жди 15 минут, или{' '}
            <Box
              component="span"
              sx={{
                color: '#1976d2',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                '&:hover': { color: '#1251a3' },
                fontSize: 17,
                borderRadius: 1,
                px: 0.5,
                display: 'inline',
                fontFamily,
              }}
              onClick={() => window.open('/premium', '_blank')}
            >
              Купить подписку
            </Box>
          </Typography>
         <Box sx={{ textAlign: 'left', mt: 3, mb: 2 }}>
           <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 16, mb: 1, color: '#1976d2' }}>
             Преимущества подписки:
           </Typography>
           <Box component="ul" sx={{ pl: 2, m: 0, fontSize: 15, color: '#222', fontFamily }}>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <CheckCircleIcon sx={{ color: '#43b324', mr: 1, fontSize: 20 }} /> 20 атомов за пост
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <StarsIcon sx={{ color: '#fbc02d', mr: 1, fontSize: 20 }} /> Специальный знак в профиле
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <ColorLensIcon sx={{ color: '#7c4dff', mr: 1, fontSize: 20 }} /> Собственная тема
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <QueryStatsIcon sx={{ color: '#1976d2', mr: 1, fontSize: 20 }} /> 45 запросов, ограничение 5 минут
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <MonetizationOnIcon sx={{ color: '#43b324', mr: 1, fontSize: 20 }} /> Кешбек за переводы
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <ForumIcon sx={{ color: '#1976d2', mr: 1, fontSize: 20 }} /> Создание 10 каналов вместо 5
             </Box>
             <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <SupportAgentIcon sx={{ color: '#ff1744', mr: 1, fontSize: 20 }} /> Поддержка 24/7
             </Box>
           </Box>
         </Box>
          <Typography sx={{ fontFamily, fontSize: 14, color: '#888', mt: 3 }}>
            Доступ через {Math.ceil((blockUntil - Date.now()) / 60000)} мин.
          </Typography>
        </Box>
      </Modal>
      <style>{`
        .blinking-cursor {
          display: inline-block;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { opacity: 0; }
        }
      `}</style>
    </Box>
  );
};

export default AI;
