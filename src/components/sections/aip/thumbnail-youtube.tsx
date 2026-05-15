"use client";

import Image from "next/image";
import { useState } from "react";

type AipThumbnailYoutubeProps = {
  videoId: string;
  thumbnailSrc: string;
};

export function AipThumbnailYoutube({ videoId, thumbnailSrc }: AipThumbnailYoutubeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplay = isPlaying ? "1" : "0";

  return (
    <div className="relative mx-auto w-full max-w-[1024px]">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=1&rel=0`}
          title="QueryPie AIP - Secure Enterprise Agentic AI Platform"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
        {!isPlaying && (
          <button
            type="button"
            aria-label="Play YouTube video"
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={thumbnailSrc}
              alt="YouTube video player"
              width={1024}
              height={576}
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="relative inline-flex h-[60px] w-[60px] items-center justify-center md:h-[80px] md:w-[80px]">
              <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full transition-transform duration-300 hover:scale-110">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M75 40C75 59.33 59.33 75 40 75C20.67 75 5 59.33 5 40C5 20.67 20.67 5 40 5C59.33 5 75 20.67 75 40ZM40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70ZM33.8422 24.945C32.1779 23.8859 30 25.0815 30 27.0542L30 52.9458C30 54.9185 32.1779 56.1141 33.8422 55.055L54.1856 42.1092C55.7294 41.1268 55.7294 38.8732 54.1856 37.8908L33.8422 24.945Z"
                  fill="#F6F6F6"
                />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
