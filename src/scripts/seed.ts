import type { CollectionSlug, Payload, PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "../payload.config";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collections: CollectionSlug[] = [
  "users",
  "categories",
  "media",
  "contacts",
  "articles",
  "news",
  "collection-pages",
];

export const seed = async ({
  payload,
  _req,
}: {
  payload: Payload;
  _req?: PayloadRequest;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  // Clear collections
  payload.logger.info("— Clearing collections...");
  for (const collection of collections) {
    await payload.delete({
      collection: collection,
      where: {
        id: {
          exists: true,
        },
      },
    });
  }

  payload.logger.info("— Creating admin user...");
  const _adminUser = await payload.create({
    collection: "users",
    data: {
      email: "admin11@example.com",
      password: "Admin123!",
      role: "admin",
    },
  });

  payload.logger.info("— Creating categories...");
  const [newsCategory, eventsCategory] = await Promise.all([
    payload.create({
      collection: "categories",
      data: {
        label: "News",
        slug: "news",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        label: "Events",
        slug: "events",
      },
    }),
  ]);

  payload.logger.info("— Creating media...");
  const imagePath = path.resolve(__dirname, "../../public/placeholder-img.png");
  const imageBuffer = fs.readFileSync(imagePath);
  const mediaDoc = await payload.create({
    collection: "media",
    data: {
      alt: "Test image",
      "alt en": "Test image",
      filename: "placeholder-img.png",
    },
    file: {
      data: imageBuffer,
      mimetype: "image/png",
      name: "placeholder-img.png",
      size: imageBuffer.length,
    },
  });

  payload.logger.info("— Creating contact...");
  const contact = await payload.create({
    collection: "contacts",
    data: {
      name: "Matti Meikäläinen",
      title: "Editor",
      email: "matti@example.com",
      phone: "+358 50 123 4567",
      categories: [newsCategory.id],
      order: 1,
      image: mediaDoc.id,
    },
  });

  payload.logger.info("— Creating article...");
  await payload.create({
    collection: "articles",
    data: {
      title: "Test article",
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ text: "This is test content.", type: "text", version: 1 }],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      author: contact.id,
      categories: [newsCategory.id, eventsCategory.id],
      publishedDate: new Date().toISOString(),
      slug: "test-article",
      _status: "published",
      image: mediaDoc.id,
    },
  });

  payload.logger.info("— Creating news...");
  await payload.create({
    collection: "news",
    data: {
      title: "Test news",
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ text: "This is the content of the news.", type: "text", version: 1 }],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      slug: "test-news",
      image: mediaDoc.id,
    },
  });

  payload.logger.info("— Creating collection page...");
  await payload.create({
    collection: "collection-pages",
    data: {
      title: "Test collection",
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                { text: "This is the content of the collection page.", type: "text", version: 1 },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      slug: "test-collection",
      image: mediaDoc.id,
    },
  });

  payload.logger.info("✨ Seed data created successfully!");
};

// Main function to initialize Payload and run seed
const runSeed = async () => {
  try {
    const payload = await getPayload({ config });
    await seed({ payload });
    process.exit(0);
  } catch (err) {
    console.error("Seed data creation failed:");
    console.error(err);
    process.exit(1);
  }
};

runSeed();
