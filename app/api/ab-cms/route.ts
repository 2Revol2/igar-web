import { NextResponse } from "next/server";
import { AbQuery } from "@/src/constants";
import { headlessCms } from "@/src/services/api/headless-cms.service";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryValue = searchParams.get(AbQuery);
  const cmsData = queryValue ? await headlessCms.refresh() : await headlessCms.get();
  return NextResponse.json(cmsData.client);
}
