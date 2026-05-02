"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, Twitter } from "lucide-react";

type PublicationShareButtonsProps = {
  title: string;
};

type ShareButtonDefinition = {
  key: string;
  label: string;
  Icon: typeof Facebook;
  buildUrl: (pageUrl: string, title: string) => string;
};

const shareButtons: readonly ShareButtonDefinition[] = [
  {
    key: "facebook",
    label: "Facebookで共有",
    Icon: Facebook,
    buildUrl: (pageUrl) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  },
  {
    key: "twitter",
    label: "Xで共有",
    Icon: Twitter,
    buildUrl: (pageUrl, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: "linkedin",
    label: "LinkedInで共有",
    Icon: Linkedin,
    buildUrl: (pageUrl) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  },
] as const;

export function PublicationShareButtons({ title }: PublicationShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getPageUrl = () => window.location.href;

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
  };

  const handleCopy = async () => {
    const pageUrl = getPageUrl();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = pageUrl;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      {shareButtons.map(({ key, label, Icon, buildUrl }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          onClick={() => openShareWindow(buildUrl(getPageUrl(), title))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] text-slate-400 transition hover:border-slate-950 hover:text-slate-950"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
      <button
        type="button"
        aria-label={copied ? "リンクをコピーしました" : "リンクをコピー"}
        onClick={() => void handleCopy()}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e5e7eb] px-3 text-slate-400 transition hover:border-slate-950 hover:text-slate-950"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
