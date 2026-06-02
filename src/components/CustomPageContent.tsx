"use client";
import { StructuredText } from "react-datocms";
import type { CustomPage, CustomPagesImageRecord } from "@/src/types";

interface CustomPageContentProps {
  page: CustomPage;
}

const renderCustomInlineBlock = ({ record }: { record: CustomPagesImageRecord }) => {
  switch (record.__typename) {
    case "CustomPagesImageRecord":
      const imagesBlock = record.images;
      if (!Array.isArray(imagesBlock) || !imagesBlock.length) return null;

      return (
        <>
          {imagesBlock.map((image) => {
            const imgData = image.responsiveImage;
            if (!imgData) return null;
            return (
              <img
                key={image.id}
                src={imgData.src}
                sizes={imgData.sizes}
                srcSet={imgData.webpSrcSet}
                alt={imgData.alt || ""}
                title={imgData.title || ""}
              />
            );
          })}
        </>
      );
    default:
      return null;
  }
};

export const CustomPageContent = ({ page }: CustomPageContentProps) => {
  return (
    <div className={"container-2025"}>
      <StructuredText data={page.pageContent} renderInlineBlock={renderCustomInlineBlock} />
    </div>
  );
};
