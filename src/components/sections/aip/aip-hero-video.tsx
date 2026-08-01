"use client";

import Image from "next/image";
import { useState } from "react";

export function AipHeroVideoPlayer({ posterSrc, videoSrc }: { posterSrc: string; videoSrc: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <video controls autoPlay playsInline className="block h-full w-full object-cover" aria-label="QueryPie AIPの紹介動画" src={videoSrc} />;
  }

  return (
    <button type="button" aria-label="QueryPie AIPの紹介動画を再生" className="group relative block h-full w-full overflow-hidden bg-[#F6F8FA]" onClick={() => setPlaying(true)}>
      <Image src={posterSrc} alt="QueryPie AIPの紹介動画のサムネイル" width={1080} height={608} priority unoptimized className="block h-full w-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition duration-200 group-hover:scale-[1.04] group-hover:bg-black/35 md:h-16 md:w-16">
          <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white md:border-y-[10px] md:border-l-[17px]" />
        </span>
      </span>
    </button>
  );
}
