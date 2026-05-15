import type { ReactNode, VideoHTMLAttributes } from "react";

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
  tracks?: readonly SelfHostedVideoTrack[];
  caption?: ReactNode;
  className?: string;
  frameClassName?: string;
  videoClassName?: string;
  fallbackDownloadLabel?: string;
} & Pick<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "controls" | "loop" | "muted" | "playsInline" | "preload"
>;

export function SelfHostedVideoPlayer({
  title,
  sources,
  poster,
  tracks = [],
  caption,
  className = "",
  frameClassName = "",
  videoClassName = "",
  fallbackDownloadLabel = "Download the video file",
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  playsInline = true,
  preload = "metadata",
}: SelfHostedVideoPlayerProps) {
  const primarySource = sources[0];

  return (
    <figure className={className}>
      <div
        className={`overflow-hidden bg-slate-950 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.75)] ${frameClassName}`}
      >
        <video
          aria-label={title}
          autoPlay={autoPlay}
          className={`block h-full w-full bg-slate-950 object-cover ${videoClassName}`}
          controls={controls}
          loop={loop}
          muted={muted}
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
      </div>
      {caption ? <figcaption className="mt-4 text-sm leading-6 text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
