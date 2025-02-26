import type { CollectionSlug, Payload, PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "../payload.config";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

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

// Helper function to fetch files from URL
async function fetchFileByURL(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file from ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return {
    data: Buffer.from(arrayBuffer),
    mimetype: "image/jpeg",
    name: `image-${Date.now()}.jpg`,
    size: arrayBuffer.byteLength,
  };
}

// Helper function to generate random date
const getRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
};

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

  // Fetch users from JSONPlaceholder API
  const usersResponse = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await usersResponse.json();

  payload.logger.info("— Creating admin user...");
  const adminUser = await payload.create({
    collection: "users",
    data: {
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
    },
  });

  payload.logger.info("— Creating categories...");
  const categoryNames = [
    "Technology",
    "Business",
    "Science",
    "Health",
    "Sports",
    "Entertainment",
    "Politics",
    "Education",
    "Environment",
    "Culture",
  ];

  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = await payload.create({
      collection: "categories",
      data: {
        label: categoryNames[i],
        slug: categoryNames[i].toLowerCase(),
      },
    });
    categories.push(category);
  }

  payload.logger.info("— Creating media...");
  const mediaItems = [];
  for (let i = 1; i <= 20; i++) {
    const imageFile = await fetchFileByURL(`https://picsum.photos/800/600?random=${i}`);
    const mediaDoc = await payload.create({
      collection: "media",
      data: {
        alt: `Random image ${i}`,
        "alt en": `Random image ${i}`,
        filename: imageFile.name,
      },
      file: imageFile,
    });
    mediaItems.push(mediaDoc);
  }

  payload.logger.info("— Creating contacts...");
  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    await payload.create({
      collection: "contacts",
      data: {
        name: user.name,
        title: user.company.catchPhrase,
        email: user.email,
        phone: user.phone,
        categories: [categories[i % categories.length].id],
        order: i + 1,
        image: mediaItems[i].id,
      },
    });
  }

  payload.logger.info("— Creating articles...");
  const postsResponse = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await postsResponse.json();

  for (let i = 0; i < 20; i++) {
    const post = posts[i];
    await payload.create({
      collection: "articles",
      data: {
        title: post.title,
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [{ text: post.body, type: "text", version: 1 }],
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
        author: adminUser.id,
        categories: [categories[i % categories.length].id],
        publishedDate: getRandomDate(),
        slug: `article-${i + 1}`,
        _status: "published",
        image: mediaItems[i].id,
      },
    });
  }

  payload.logger.info("— Creating news...");
  for (let i = 0; i < 20; i++) {
    const post = posts[i + 20];
    await payload.create({
      collection: "news",
      data: {
        title: post.title,
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [{ text: post.body, type: "text", version: 1 }],
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
        slug: `news-${i + 1}`,
        image: mediaItems[i].id,
      },
    });
  }

  payload.logger.info("— Creating collection pages...");
  for (let i = 0; i < 20; i++) {
    const post = posts[i + 40];
    await payload.create({
      collection: "collection-pages",
      data: {
        title: `Collection ${i + 1}: ${post.title}`,
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [{ text: post.body, type: "text", version: 1 }],
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
        slug: `collection-${i + 1}`,
        image: mediaItems[i].id,
      },
    });
  }

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
