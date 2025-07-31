import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FiCommand, FiImage, FiSmile, FiGitPullRequest } from "react-icons/fi";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { customIcons } from '../../components/icon'; // Импорт кастомных иконок

const PostCreator = ({ onPostCreated }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCustomEmojiPicker, setShowCustomEmojiPicker] = useState(false);
  const [inputText, setInputText] = useState('');
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ x: 0, y: 0 });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUploadVisible, setImageUploadVisible] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .post-textarea::placeholder {
        color: rgb(114, 114, 114) !important;
      }
      @keyframes pulse {
        0% { opacity: 0.3; color: rgba(255, 255, 255, 1); }
        50% { opacity: 1; color: rgba(255, 255, 255, 1); }
        100% { opacity: 0.3; color: rgba(255, 255, 255, 1); }
      }
      .pulse-icon {
        animation: pulse 3s ease-in-out infinite;
      }
      .image-upload-panel {
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
        max-height: 0;
      }
      .image-upload-panel.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
        max-height: 300px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji.native);
  };

  const handleEmojiPickerClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setEmojiPickerPosition({ x: rect.left, y: rect.bottom });
    setShowEmojiPicker(true);
  };

  const handleCustomEmojiPickerClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setEmojiPickerPosition({ x: rect.left, y: rect.bottom });
    setShowCustomEmojiPicker(true);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showEmojiPicker) setShowEmojiPicker(false);
        if (showCustomEmojiPicker) setShowCustomEmojiPicker(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showEmojiPicker, showCustomEmojiPicker]);

  useEffect(() => {
    if (showImageUpload) {
      setImageUploadVisible(true);
    } else {
      const timeout = setTimeout(() => setImageUploadVisible(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [showImageUpload]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleSend = async () => {
    setError('');
  

    
    if (onPostCreated) {
      onPostCreated({
        title: inputText,
        image: selectedImage,
        createdAt: new Date().toISOString(),
      });
    }
    
    setInputText('');
    setSelectedImage(null);
    setShowImageUpload(false);
    setShowEmojiPicker(false);
    setShowCustomEmojiPicker(false);
    setDragActive(false);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    setError('');
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          minHeight: '100px',
          marginTop: '10px',
          borderRadius: '10px',
          backgroundColor: 'rgba(43, 50, 57, 1)',
          paddingTop: '15px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: '15px',
          position: 'relative',
        }}
      >
        <Typography sx={{color:"rgba(129, 129, 129, 1)", fontSize:'15px', marginBottom: '10px'}}>Мастер создания постов</Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'rgba(56, 65, 74, 1)',
          borderRadius: '8px',
          border: '1px solid rgba(63, 72, 82, 1)',
          padding: '2px',
          '&:hover': {
            borderColor: 'rgb(100, 100, 100)',
          },
          '&:focus-within': {
            borderColor: 'rgb(78, 78, 78)',
            borderWidth: '1px',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: 0.2 }}>
            <IconButton 
              size="small"
              onClick={() => setShowImageUpload((prev) => !prev)}
              sx={{ 
                width: '24px',
                height: '24px',
                color: showImageUpload ? 'rgba(126, 126, 126, 1)' : 'rgba(154, 153, 153, 1)',
                backgroundColor: showImageUpload ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(150, 150, 150, 0.1)'
                }
              }}
            >
              <FiImage size={16} />
            </IconButton>
            <IconButton 
              size="small"
              onClick={handleCustomEmojiPickerClick}
              sx={{ 
                width: '24px',
                height: '24px',
                color: showImageUpload ? 'rgba(126, 126, 126, 1)' : 'rgba(154, 153, 153, 1)',
                backgroundColor: showImageUpload ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(150, 150, 150, 0.1)'
                }
              }}
            >
              <FiSmile size={16} />
            </IconButton>
        
          </Box>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите текст поста..."
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'transparent',
              padding: '4px 0',
              paddingLeft:'10px',
              resize: 'none',
              overflow: 'hidden',
              fontFamily: 'inherit',
              lineHeight: '1.2',
              minHeight: '20px',
              maxHeight: '300px',
            }}
            className="post-textarea"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />

          <IconButton 
            size="small"
            onClick={handleSend}
            disabled={loading}
            sx={{ 
              color: showImageUpload ? 'rgba(126, 126, 126, 1)' : 'rgba(154, 153, 153, 1)',
              backgroundColor: showImageUpload ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRadius:"5px",
              marginLeft: 0.2,
              width: '28px',
              height: '28px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(150, 150, 150, 0.1)',
              }
            }}
          >
            {loading ? (
              <span className="loader" style={{ width: 18, height: 18, display: 'inline-block', border: '2px solid #ccc', borderTop: '2px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <FiGitPullRequest 
                size={18} 
                className={!inputText.trim() ? 'pulse-icon' : ''}
              />
            )}
          </IconButton>
        </Box>
        {error && <div style={{ color: 'red', fontSize: 13, marginTop: 6 }}>{error}</div>}
        
        {(imageUploadVisible || showImageUpload) && (
          <Box
            className={`image-upload-panel${showImageUpload ? ' open' : ''}`}
            sx={{
              marginTop: '10px',
              padding: '18px',
              border: dragActive ? '2px dashed #1976d2' : '2px dashed #bdbdbd',
              borderRadius: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border 0.2s, background 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => document.getElementById('image-upload-input')?.click()}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
            onDrop={e => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedImage(e.dataTransfer.files[0]);
                if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                setImagePreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
              }
            }}
          >
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedImage(e.target.files[0]);
                  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                  setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {selectedImage ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={imagePreviewUrl}
                  alt="preview"
                  style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', marginBottom: '8px' }}
                />
                <Typography sx={{ fontSize: '13px', color: '#1976d2', mb: 1 }}>{selectedImage.name}</Typography>
                <IconButton size="small" onClick={e => { e.stopPropagation(); setSelectedImage(null); if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null); } }}>
                  ✕
                </IconButton>
              </Box>
            ) : (
              <Typography sx={{ color: '#888', fontSize: '15px' }}>
                Перетащите фото или выберите его
              </Typography>
            )}
          </Box>
        )}
        <Typography sx={{color:"rgb(147, 146, 146)", fontSize:'10px', marginTop: '5px', marginLeft: '3px' , marginBottom: '0px'}}>Создавая посты вы соглашаетесь с правилами публикации постов</Typography>
      </Box>

      {/* Стандартный Emoji Picker */}
      {showEmojiPicker && (
        <Box 
          className="emoji-picker-container"
          sx={{ 
            position: 'fixed', 
            top: emojiPickerPosition.y + 5, 
            left: emojiPickerPosition.x, 
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgb(150, 150, 150)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            padding: '8px',
            borderBottom: '1px solid rgb(240, 240, 240)',
            backgroundColor: 'rgb(250, 250, 250)'
          }}>
            <IconButton 
              size="small"
              onClick={() => setShowEmojiPicker(false)}
              sx={{ 
                width: '20px',
                height: '20px',
                color: 'rgb(100, 100, 100)',
                '&:hover': {
                  backgroundColor: 'rgba(100, 100, 100, 0.1)',
                }
              }}
            >
              ✕
            </IconButton>
          </Box>
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            set="native"
            previewPosition="none"
            skinTonePosition="none"
            maxFrequentRows={0}
            locale="ru"
            skinTonesDisabled={true}
            searchDisabled={false}
          />
        </Box>
      )}

      {/* Кастомное меню для эмодзи */}
      {showCustomEmojiPicker && (
        <Box 
          className="custom-emoji-picker-container"
          sx={{ 
            position: 'fixed', 
        
            zIndex: 1000,
            right:0,
            top:0,
            marginRight:'20px',
            marginTop:'10px',
            backgroundColor: 'rgba(56, 65, 74, 1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(63, 72, 82, 1)',
            overflow: 'hidden',
            width: '300px',
            height: '170px',
            padding: '16px'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(63, 72, 82, 1)',
            marginBottom: '12px'
          }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Стикеры AtomGlide</Typography>
            <Box 
              onClick={() => setShowCustomEmojiPicker(false)}
              sx={{ 
                width: '13px',
                height: '13px',
                borderRadius:'100px',
                backgroundColor: 'rgba(255, 57, 57, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
           
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px', 
            marginTop: '16px',
            justifyContent: 'center'
          }}>
            {Object.entries(customIcons).map(([key, { component: Icon, keyword }]) => (
              <IconButton
                key={key}
                onClick={() => {
                  setInputText(prev => prev + keyword);
                  setShowCustomEmojiPicker(false);
                }}
                sx={{
                  width: '40px',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default PostCreator;