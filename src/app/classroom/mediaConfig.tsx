export function setVoiceConfig(voice: boolean) {
  localStorage.setItem("voice", voice.toString());
}

export function setVideoConfig(video: boolean) {
  localStorage.setItem("video", video.toString());
}

export function getMediaConfig() {
  return {
    audio: localStorage.getItem("voice") === "true",
    video: localStorage.getItem("video") === "true",
  };
}
