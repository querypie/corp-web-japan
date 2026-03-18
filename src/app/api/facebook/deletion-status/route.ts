import { NextRequest, NextResponse } from "next/server";

// Status page for Facebook data deletion requests
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing confirmation code", { status: 400 });
  }

  // Return a simple HTML page showing deletion status
  const html = `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><title>데이터 삭제 상태</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px">
  <h1>데이터 삭제 요청</h1>
  <p>확인 코드: <strong>${code}</strong></p>
  <p>귀하의 데이터 삭제 요청이 처리되었습니다.</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
