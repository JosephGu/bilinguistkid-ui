"use client";

export function setVoiceConfig(voice: boolean) {
  localStorage.setItem("voice", voice.toString());
}

export function setVideoConfig(video: boolean) {
  localStorage.setItem("video", video.toString());
}

export function getMediaConfig() {
  if(typeof window === "undefined") {
    return {
      audio: false,
      video: false,
    };
  }
  return {
    audio: localStorage.getItem("voice") === "true",
    video: localStorage.getItem("video") === "true",
  };
}
