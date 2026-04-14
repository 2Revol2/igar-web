import { NextResponse } from "next/server";
import { removeDomain } from "@/src/helpers/proxy/proxy.heplers";

export function proxy(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const changedURl = removeDomain(request.url);
  requestHeaders.set("x-url", changedURl);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
