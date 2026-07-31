"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroAipMotionProps = {
  posterSrc: string;
  videoSrc: string;
  delayMs?: number;
};

export function HeroAipMotion({
  posterSrc,
  videoSrc,
  delayMs = 3000,
}: HeroAipMotionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setTimeout(() => setShouldLoadVideo(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  function playVideo() {
    void videoRef.current?.play().catch(() => undefined);
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterSrc}
          onCanPlay={playVideo}
          onPlaying={() => setIsPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-700 motion-reduce:hidden ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
