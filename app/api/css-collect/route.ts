import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { hrefs, pageUrl } = body;

    console.log("CSS URLs:", hrefs);
    console.log("Page:", pageUrl);

    // 👉 тут вызываешь свой сервис
    // await customCssService.readCssAndReplaceColors(...)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
