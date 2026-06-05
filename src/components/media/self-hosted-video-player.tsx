"use client";

import Image from "next/image";
import type { ReactNode, VideoHTMLAttributes } from "react";
import { useRef, useState } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export type SelfHostedVideoSource = {
  src: string;
  type: string;
  label?: string;
};

export type SelfHostedVideoTrack = {
  src: string;
  kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
  srcLang: string;
  label: string;
  default?: boolean;
};

type SelfHostedVideoPlayerProps = {
  title: string;
  sources: readonly SelfHostedVideoSource[];
  poster?: string;
  posterAlt?: string;
  tracks?: readonly SelfHostedVideoTrack[];
  caption?: ReactNode;
  className?: string;
  frameClassName?: string;
  videoClassName?: string;
  fallbackDownloadLabel?: string;
  showPosterOverlay?: boolean;
} & Pick<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "controls" | "loop" | "muted" | "playsInline" | "preload"
>;

export function SelfHostedVideoPlayer({
  title,
  sources,
  poster,
  posterAlt,
  tracks = [],
  caption,
  className = "",
  frameClassName = "",
  videoClassName = "",
  fallbackDownloadLabel = "Download the video file",
  showPosterOverlay = true,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  playsInline = true,
  preload = "metadata",
}: SelfHostedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const primarySource = sources[0];
  const shouldShowPosterOverlay = showPosterOverlay && poster && !hasStarted;

  const startPlayback = () => {
    setHasStarted(true);
    void videoRef.current?.play();
  };

  return (
    <figure {...componentNameDebugProps("SelfHostedVideoPlayer")} className={className}>
      <div className={`relative overflow-hidden bg-slate-950 ${frameClassName}`}>
        <video
          ref={videoRef}
          aria-label={title}
          autoPlay={autoPlay}
          className={`absolute inset-0 h-full w-full bg-slate-950 object-cover ${videoClassName}`}
          controls={controls}
          loop={loop}
          muted={muted}
          onPlay={() => setHasStarted(true)}
          playsInline={playsInline}
          poster={poster}
          preload={preload}
        >
          {sources.map((source) => (
            <source key={`${source.type}:${source.src}`} src={source.src} type={source.type} />
          ))}
          {tracks.map((track) => (
            <track
              key={`${track.kind}:${track.srcLang}:${track.src}`}
              default={track.default}
              kind={track.kind}
              label={track.label}
              src={track.src}
              srcLang={track.srcLang}
            />
          ))}
          {primarySource ? (
            <a href={primarySource.src}>{fallbackDownloadLabel}</a>
          ) : (
            "Your browser does not support the video element."
          )}
        </video>

        {shouldShowPosterOverlay ? (
          <button
            type="button"
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={startPlayback}
          >
            <Image
              src={poster}
              alt={posterAlt ?? title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="absolute inset-0 object-cover"
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
        ) : null}
      </div>
      {caption ? <figcaption className="mt-4 text-sm leading-6 text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
