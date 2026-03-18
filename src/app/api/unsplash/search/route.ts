import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
  width: number;
  height: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const perPage = searchParams.get("per_page") || "9";
  const orientation = searchParams.get("orientation") || "portrait";

  if (!query) {
    return NextResponse.json({ error: "검색어를 입력해주세요." }, { status: 400 });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Unsplash API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", perPage);
    url.searchParams.set("orientation", orientation);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Unsplash API error:", res.status, text);
      return NextResponse.json(
        { error: "이미지 검색에 실패했습니다." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const photos = (data.results as UnsplashPhoto[]).map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      small: photo.urls.small,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      width: photo.width,
      height: photo.height,
    }));

    return NextResponse.json({ photos, total: data.total });
  } catch (error) {
    console.error("Unsplash search error:", error);
    return NextResponse.json(
      { error: "이미지 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
