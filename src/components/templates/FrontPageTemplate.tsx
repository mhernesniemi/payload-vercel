import { BlockRenderer } from "@/components/BlockRenderer";
import { FrontPage } from "@/payload-types";
type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  return (
    <main id="main-content">
      {content.hero && <BlockRenderer blocks={content.hero} />}
      <div className="mx-auto max-w-screen-lg py-16">
        {content.content && <BlockRenderer blocks={content.content} />}
      </div>
    </main>
  );
}
