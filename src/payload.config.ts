// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";

import { FrontPage } from "./globals/FrontPage";
import { MainMenu } from "./globals/MainMenu";
import { CollectionPage } from "./collections/collection-page";
import { FooterMenu } from "./globals/FooterMenu";
import { Footer } from "./globals/Footer";
import { Users } from "./collections/users";
import { Media } from "./collections/media";
import { Articles } from "./collections/articles";
import { News } from "./collections/news";
import { Categories } from "./collections/categories";
import { Contacts } from "./collections/contacts";
import { AIRichTextFeature } from "./features/lexical/ai-richtext-feature/feature.server";
import { seoConfig } from "./fields/seo";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: "light",
    dateFormat: "dd.MM.yyyy",
  },
  collections: [Users, Media, Articles, CollectionPage, News, Categories, Contacts],
  globals: [FrontPage, MainMenu, FooterMenu, Footer],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, AIRichTextFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
      authToken: process.env.DATABASE_AUTH_TOKEN || "",
    },
    // push: false,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoConfig,
    nestedDocsPlugin({
      collections: ["categories"],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
  ],
});
