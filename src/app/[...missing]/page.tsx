import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type MissingRoutePageProps = {
  params: Promise<{
    missing: string[];
  }>;
};

export default async function MissingRoutePage({ params }: MissingRoutePageProps) {
  const { missing } = await params;
  const requestHeaders = await headers();
  const requestedPath = `/${missing.join("/")}`;

  console.log(
    "[runtime-404]",
    JSON.stringify({
      requestedPath,
      host: requestHeaders.get("host"),
      referer: requestHeaders.get("referer"),
      userAgent: requestHeaders.get("user-agent"),
    }),
  );

  notFound();
}
