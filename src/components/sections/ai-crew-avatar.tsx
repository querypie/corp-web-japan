import Image from "next/image";

type AICrewAvatarProps = {
  size?: "mobile" | "desktop";
  alt?: string;
  tone?: "white" | "gray";
};

const sizeClassMap = {
  mobile: "h-[84px] w-[62px]",
  desktop: "h-[156px] w-[114px]",
} as const;

export function AICrewAvatar({
  size = "desktop",
  alt = "QueryPie AI Crew navigator avatar",
  tone = "white",
}: AICrewAvatarProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative ${sizeClassMap[size]} animate-[crewFloat_6s_ease-in-out_infinite] motion-reduce:animate-none`}
    >
      <div
        className={`absolute inset-[10%] rounded-full blur-[10px] ${tone === "gray" ? "bg-[#f6f8fb]" : "bg-white/94"}`}
        aria-hidden="true"
      />
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={tone === "gray" ? "/crew/ai-crew-gray.png" : "/crew/ai-crew-white.png"}
          alt=""
          fill
          aria-hidden="true"
          sizes={size === "desktop" ? "114px" : "62px"}
          className="object-cover object-left opacity-90 saturate-[0.9] brightness-[1.02]"
        />
      </div>
    </div>
  );
}
