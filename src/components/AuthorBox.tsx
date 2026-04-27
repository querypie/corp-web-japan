import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import type { PublicationPostAuthor } from "@/lib/publications/types";

type AuthorBoxProps = {
  author: PublicationPostAuthor;
};

export function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <div className="flex items-start gap-[14px] rounded-[10px] bg-[#F9FAFB] px-[26px] py-5">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[#E5E7EB] bg-white">
        <Image
          src={author.avatarSrc}
          alt={author.avatarAlt || author.name}
          width={96}
          height={96}
          className={`h-full w-full ${
            author.avatarSrc === "/assets/images/wp28/qp-logo-icon.png"
              ? "object-contain p-2"
              : "object-cover"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-[6px] flex items-start justify-between gap-2">
          <div>
            <p className="text-[15px] font-medium leading-[1.4] text-slate-950">{author.name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{author.role}</p>
          </div>
          {author.profileUrl ? (
            <Link
              href={author.profileUrl}
              className="inline-flex h-7 w-7 items-center justify-center text-[#6B7280] transition hover:text-slate-950"
              aria-label={`${author.name} profile`}
            >
              <Linkedin className="h-[15px] w-[15px]" />
            </Link>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-slate-500">{author.bio}</p>
      </div>
    </div>
  );
}
