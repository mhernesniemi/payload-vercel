"use client";

import { FrontPage } from "@/payload-types";
import { BlockRenderer } from "@/components/BlockRenderer";
type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  return (
    <div>
      {content.hero && <BlockRenderer blocks={content.hero} />}
      <div className="mx-auto max-w-screen-lg py-16">
        <BlockRenderer blocks={content.content} />
      </div>
    </div>
  );
}
