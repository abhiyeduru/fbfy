"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

export function BrandVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="film" className="relative w-full py-28 md:py-36 bg-[#060608] border-t border-b border-white/5 overflow-hidden">
      {/* Subtle Studio Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <span className="font-mono-clean text-[11px] tracking-[0.3em] text-[#8E8E93] uppercase block mb-3">
              MOTION & RUNWAY ARCHIVE
            </span>
            <h2 className="font-brand text-3xl md:text-5xl text-white font-extrabold tracking-tight">
              CAMPAIGN FILM
            </h2>
          </div>

          <div className="flex items-center gap-4 font-mono-clean text-xs text-[#8E8E93]">
            <span>4K MOTION CAPTURE</span>
            <span className="text-white/20">•</span>
            <span>FBFY STUDIO</span>
          </div>
        </div>

        {/* Cinematic Video Player Container */}
        <div className="relative w-full aspect-[9/16] md:aspect-[16/9] max-h-[750px] bg-black border border-white/10 overflow-hidden group shadow-2xl">
          <video
            ref={videoRef}
            src="/assets/brand_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Minimal Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left Metadata Overlay */}
          <div className="absolute top-6 left-6 font-mono-clean text-xs text-white/80 space-y-1 bg-black/40 backdrop-blur-md px-3 py-2 border border-white/10">
            <span className="block font-bold tracking-widest text-white">
              FBFY // MOTION 01
            </span>
            <span className="block text-[10px] text-[#A1A1A6]">
              REAL-TIME GARMENT DRAPE & MOTION
            </span>
          </div>

          {/* Interactive Player Controls Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                className="p-3 bg-white text-black hover:bg-[#E8E8E4] transition-colors flex items-center gap-2 font-mono-clean text-xs uppercase tracking-wider font-bold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span className="hidden sm:inline">PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span className="hidden sm:inline">PLAY</span>
                  </>
                )}
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                className="p-3 bg-[#111115]/90 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2 font-mono-clean text-xs uppercase tracking-wider"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-[#8E8E93]" />
                    <span className="hidden sm:inline text-[#8E8E93]">AUDIO OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">AUDIO ON</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Fullscreen Trigger */}
            <button
              onClick={handleFullscreen}
              aria-label="Fullscreen Video"
              className="p-3 bg-[#111115]/90 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2 font-mono-clean text-xs uppercase tracking-wider"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">EXPAND</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
