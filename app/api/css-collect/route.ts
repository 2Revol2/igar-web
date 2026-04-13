import { NextResponse } from "next/server";
import { customCssService } from "../../services/custom-css/custom-css.service";
import type { NextRequest } from "next/server";
import type { HeadLink } from "@/app/types";

type CssCollectRequest = {
  hrefs: string[];
  pageUrl: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CssCollectRequest;
    const { hrefs, pageUrl } = body;
    if (!hrefs) {
      throw new Error("Missing required parameters");
    }
    const headLinks: Array<Pick<HeadLink, "href">> = hrefs.map((href) => ({ href }));
    await customCssService.readCssAndReplaceColors(headLinks, true);
    console.log(" --- Next css fetch: ");
    console.log("CSS URLs:", hrefs);
    console.log("Page:", pageUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
