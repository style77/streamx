"use client"
import { Chat } from "@/components/chat";
import { VideoPlayer } from "@/components/video-player";
import { useEffect, useState } from "react";

export default function Page({ params }: {
    params: {
        username: string
    }
}) {
    let username = decodeURIComponent(params.username)
    if (!username.startsWith("@")) {
        username = "@" + username
    }

    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        const checkIfStreaming = async () => {
            let response;
            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_HLS_URL}/hls/${username.slice(1)}/index.m3u8`);
            } catch (error) {
                setIsStreaming(false);
                return;
            }
            if (response.status === 200) {
                setIsStreaming(true);
            } else {
                setIsStreaming(false);
            }
        }
        checkIfStreaming();
    }, []);

    return (
        <section className="flex flex-col w-full h-full">
            <div className="flex flex-row w-full h-full">
                <VideoPlayer username={username.slice(1)} isStreaming={isStreaming} />
                <Chat username={username.trim()} isStreaming={isStreaming} />
            </div>
            <div className="flex flex-row items-center justify-between w-full px-4 py-2 bg-black/50 md:hidden">
                <div className="flex flex-row items-center justify-center">
                    <p className="text-white">{username}</p>
                </div>
                <div className="flex flex-row items-center justify-center">
                    <p className="text-white">0 viewers</p>
                </div>
            </div>
        </section>
    )
}