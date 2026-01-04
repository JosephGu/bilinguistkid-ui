'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Peer from 'peerjs'
import { getMediaConfig, setVoiceConfig, setVideoConfig } from '../mediaConfig'
import { IconButton } from '@mui/material'
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const peerRef = useRef<Peer | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [audioOn, setAudioOn] = useState(getMediaConfig().audio)
  const [videoOn, setVideoOn] = useState(getMediaConfig().video)

  useEffect(() => {
    if (!roomId) return

    let destroyed = false

    async function init() {
      // 1️⃣ 获取本地音视频
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoOn,
        audio: audioOn
      })
      localStreamRef.current = stream
      addVideo(stream, true)

      // 2️⃣ 创建 Peer（连接独立 PeerJS Server）
      const peer = new Peer('', {
        host: process.env.NEXT_PUBLIC_PEER_HOST,
        port: Number(process.env.NEXT_PUBLIC_PEER_PORT),
        path: process.env.NEXT_PUBLIC_PEER_PATH,
        secure: location.protocol === 'https:'
      })

      peerRef.current = peer

      // 3️⃣ 接听别人打过来的 call
      peer.on('call', call => {
        call.answer(stream)
        call.on('stream', remoteStream => {
          addVideo(remoteStream)
        })
      })

      // 4️⃣ Peer ready 后加入会议
      peer.on('open', async peerId => {
        if (destroyed) return

        const res = await fetch('/api/meeting/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, peerId })
        })

        if (!res.ok) {
          alert('Room not found')
          return
        }

        const { peers } = await res.json()

        // 5️⃣ 主动连接已有成员
        peers.forEach((remotePeerId: string) => {
          const call = peer.call(remotePeerId, stream)
          call.on('stream', remoteStream => {
            addVideo(remoteStream)
          })
        })

        // 6️⃣ 启动心跳
        startHeartbeat(peerId)
      })
    }

    init()

    return () => {
      destroyed = true

      heartbeatTimerRef.current &&
        clearInterval(heartbeatTimerRef.current)

      peerRef.current?.destroy()

      localStreamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [roomId])

  // ------------------------
  // 心跳
  // ------------------------
  function startHeartbeat(peerId: string) {
    heartbeatTimerRef.current = setInterval(() => {
      fetch('/api/meeting/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId })
      })
    }, 20_000)
  }

  // ------------------------
  // 视频渲染
  // ------------------------
  function addVideo(stream: MediaStream, muted = false) {
    const video = document.createElement('video')
    video.srcObject = stream
    video.autoplay = true
    video.playsInline = true
    video.muted = muted

    videoContainerRef.current?.appendChild(video)
  }

  function resetAudio(audioOn: boolean) {
    setAudioOn(audioOn);
    setVoiceConfig(audioOn);
    localStreamRef.current?.getAudioTracks().forEach(t => t.enabled = audioOn)
  }

  function resetVideo(videoOn: boolean) {
    setVideoOn(videoOn)
    setVideoConfig(videoOn);
    localStreamRef.current?.getVideoTracks().forEach(t => t.enabled = videoOn)
  }

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <div
        ref={videoContainerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12
        }}
      />
      <IconButton onClick={() => resetAudio(!audioOn)}>
        {audioOn ? <Mic color="primary" /> : <MicOff />}
      </IconButton>
      <IconButton onClick={() => resetVideo(!videoOn)}>
        {videoOn ? <Videocam color="primary" /> : <VideocamOff />}
      </IconButton>
      {peerRef.current?.id && (
        <p>Your Peer ID: {peerRef.current?.id}</p>
      )}
    </div>
  )
}
