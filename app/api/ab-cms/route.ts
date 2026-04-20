import { NextResponse } from "next/server";
import { AbQuery } from "@/src/constants";
import { headlessCms } from "@/src/services/api/headless-cms.service";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryValue = searchParams.get(AbQuery);
  const cmsDataMethod = queryValue ? headlessCms.refresh : headlessCms.get;
  const cmsData = await cmsDataMethod();
  return NextResponse.json(cmsData.client);
}
