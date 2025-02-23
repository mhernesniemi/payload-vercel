"use client";

import { FrontPage } from "@/payload-types";
import { BlockRenderer } from "@/components/BlockRenderer";
type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  console.log("content", content);
  return (
    <div className="mx-auto max-w-screen-md py-16">
      <BlockRenderer blocks={content.content} />
      {content.hero && <BlockRenderer blocks={content.hero} />}
    </div>
  );
}
