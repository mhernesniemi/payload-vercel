import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Articles } from "./collections/articles";
import { Categories } from "./collections/categories";
import { CollectionPage } from "./collections/collection-page";
import { Contacts } from "./collections/contacts";
import { Media } from "./collections/media";
import { News } from "./collections/news";
import { Users } from "./collections/users";
import { seoConfig } from "./fields/seo";
import { Footer } from "./globals/Footer";
import { FooterMenu } from "./globals/FooterMenu";
import { FrontPage } from "./globals/FrontPage";
import { MainMenu } from "./globals/MainMenu";

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
    features: ({ defaultFeatures }) => [...defaultFeatures],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URI,
    },
  }),
  graphQL: {
    disable: true,
  },
  plugins: [
    payloadCloudPlugin(),
    seoConfig,
    nestedDocsPlugin({
      collections: ["categories"],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
