'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Tooltip, Box, CircularProgress, Typography } from '@mui/material';
import { PlayCircleOutline, PauseCircleOutline, VolumeUp, VolumeOff, Error } from '@mui/icons-material';

interface AudioPlayerProps {
  audioBase64: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBase64 }) => {
  // 音频相关状态
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // 音频元素引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  // 创建音频对象
  useEffect(() => {
    // 清理之前的音频实例
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 验证base64字符串
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      setHasError(true);
      return;
    }

    try {
      // 创建音频URL
      const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
      audioSourceRef.current = audioUrl;
      
      // 创建音频元素
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // 音频加载完成处理
      audio.oncanplaythrough = () => {
        setIsLoading(false);
        setHasError(false);
      };
      
      // 音频错误处理
      audio.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
      };
      
      // 音频结束处理
      audio.onended = () => {
        setIsPlaying(false);
      };

      setIsLoading(true);
      setHasError(false);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setHasError(true);
      setIsLoading(false);
    }

    // 组件卸载时清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioBase64]);

  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioRef.current || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Failed to play audio:', error);
          setHasError(true);
          setIsPlaying(false);
        });
    }
  };

  // 切换静音
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <Tooltip title="加载音频中...">
        <IconButton disabled color="primary">
          <CircularProgress size={24} />
        </IconButton>
      </Tooltip>
    );
  }

  // 渲染错误状态
  if (hasError) {
    return (
      <Tooltip title="音频加载失败">
        <IconButton color="error">
          <Error />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title={isPlaying ? "暂停" : "播放"}>
        <IconButton onClick={togglePlay} color="primary" size="large">
          {isPlaying ? <PauseCircleOutline /> : <PlayCircleOutline />}
        </IconButton>
      </Tooltip>
      
      <Tooltip title={isMuted ? "取消静音" : "静音"}>
        <IconButton onClick={toggleMute} color="primary">
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AudioPlayer;
