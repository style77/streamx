"use client"
import React, { useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Share2, MoreHorizontal, Heart, Maximize, Cog, Settings } from 'lucide-react';
import HlsPlayer from 'react-hls-player';

export function VideoPlayer({ username, isStreaming }: { username: string, isStreaming: boolean }) {
    const playerRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {
                isStreaming ? (
                    <HlsPlayer
                        loop={true}
                        width="1920"
                        height="1080"
                        autoPlay={true}
                        controls={true}
                        playerRef={playerRef}
                        src={`${process.env.NEXT_PUBLIC_HLS_URL}/hls/${username}/index.m3u8`}
                        hlsConfig={
                            {
                                "enableWorker": true,
                                "maxBufferLength": 1,
                                "liveBackBufferLength": 0,
                                "liveSyncDuration": 0,
                                "liveMaxLatencyDuration": 5,
                                "liveDurationInfinity": true,
                                "highBufferWatchdogPeriod": 1,
                            }
                        }
                        className="w-full h-screen"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-screen bg-black">
                        <p className="text-white">Stream is offline</p>
                    </div>
                )
            }
        </div>
    );
}