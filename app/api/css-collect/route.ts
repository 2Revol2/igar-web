import { NextResponse } from "next/server";
import { customCssService } from "../../services/custom-css/custom-css.service";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { hrefs, pageUrl } = body;

    await customCssService.readCssAndReplaceColors(hrefs, true);

    console.log(" --- Nuxt css fetch: ");
    console.log("CSS URLs:", hrefs);
    console.log("Page:", pageUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
