"use client";

import {useCallback, useEffect, useState} from "react";
import {ContentResponse} from "@/app/types";
import {usePathname, useSearchParams} from "next/navigation";
import { AppLoader } from "./loader";
import { AppNotFound } from "./notFound";
import { AppSafeContent } from "./content";

export const AppMain = () => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const pathname = usePathname(); // Текущий путь (например, "/about")
    // const searchParams = useSearchParams();

    const _fetchContent  = useCallback(async (pathToFetch: string): Promise<ContentResponse>  => {
        const body = JSON.stringify({ path: pathToFetch });
        const options = { method: "PUT", body };
        const response = await fetch(`/api/content`, options);
        return response.json();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        _fetchContent(pathname)
            .then((data) => setContent(data.content))
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }, [pathname, _fetchContent]);
  return isLoading
    ? <AppLoader />
    : content ? <AppSafeContent html={content} /> : <AppNotFound />;
}