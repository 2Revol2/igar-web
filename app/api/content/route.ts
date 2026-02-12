import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';
import { NextRequest, NextResponse } from "next/server";

const WEBSITE = "https://velvet-pro.ru"
const CACHE_DIR = join(process.cwd(), 'cache');

const _fetchContent = async (pathToFetch: string, cacheFilePath: string) => {
    const res = await fetch(`${WEBSITE}${pathToFetch}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    const html = await res.text();
    const dom = new JSDOM(html);
    const { window } = dom;
    const { document } = window;
    const header = document.querySelector('header');
    if (header) {
        header.remove();
    }
    const cleanedHtml = dom.serialize();
    await writeFile(cacheFilePath, cleanedHtml, 'utf-8');
    return cleanedHtml;
}

export async function PUT(
  request: NextRequest,
) {
        const body = await request.json();
        console.log(body);
        await new Promise(resolve => {
            setTimeout(resolve, 3000);
        })
        // if (!url) {
        //     return new Response(
        //         JSON.stringify({ error: 'URL is required' }),
        //         { status: 400 }
        //     );
        // }

        const pathToFetch = "/";

        const fileName = !pathToFetch || pathToFetch === "/" ? "___" : pathToFetch;

        const cacheFilePath = join(CACHE_DIR, encodeURIComponent(fileName) + '.html');

        try {
            const isCached = existsSync(cacheFilePath);

            if (!isCached) {
                const content = await _fetchContent(pathToFetch, cacheFilePath);
                return NextResponse.json({ content }, { status: 200 });
            }

            // @TODO: Prevent content fetching too often
            _fetchContent(pathToFetch, cacheFilePath);
            const cachedHtml = await readFile(cacheFilePath, 'utf-8');
            return NextResponse.json({ content: cachedHtml }, { status: 200 });
        } catch (reason) {
            console.log(reason);
            const message =
                reason instanceof Error ? reason.message : 'Unexpected exception'
            return new Response(message, { status: 500 })
        }
}
