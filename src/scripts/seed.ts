import type { CollectionSlug, Payload, PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "../payload.config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUMBER_OF_CONTACTS = 20;
const NUMBER_OF_MEDIA = 20;
const NUMBER_OF_ARTICLES = 20;
const NUMBER_OF_COLLECTION_PAGES = 20;
const NUMBER_OF_NEWS = 20;

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

  // Fetch users from DummyJSON API
  const usersResponse = await fetch("https://dummyjson.com/users");
  const usersData = await usersResponse.json();
  const users = usersData.users; // DummyJSON palauttaa käyttäjät users-kentässä

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
  for (let i = 1; i <= NUMBER_OF_MEDIA; i++) {
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
  for (let i = 0; i < NUMBER_OF_CONTACTS; i++) {
    const user = users[i % users.length];
    await payload.create({
      collection: "contacts",
      data: {
        name: `${user.firstName} ${user.lastName}`,
        title: user.company.title,
        email: user.email,
        phone: user.phone,
        categories: [categories[i % categories.length].id],
        order: i + 1,
        image: mediaItems[i].id,
      },
    });
  }

  payload.logger.info("— Creating articles...");
  const postsResponse = await fetch("https://dummyjson.com/posts?limit=100");
  const postsData = await postsResponse.json();
  const posts = postsData.posts;

  for (let i = 0; i < NUMBER_OF_ARTICLES; i++) {
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
  for (let i = 0; i < NUMBER_OF_NEWS; i++) {
    const post = posts[i + NUMBER_OF_ARTICLES];
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
  for (let i = 0; i < NUMBER_OF_COLLECTION_PAGES; i++) {
    const post = posts[i + NUMBER_OF_ARTICLES + NUMBER_OF_NEWS];
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
  payload.logger.info("— Creating front page...");
  await payload.updateGlobal({
    slug: "front-page",
    data: {
      hero: [
        {
          blockType: "hero",
          title: "Welcome to Our Website",
          description: "Discover our latest articles, news and collections",
          image: mediaItems[0].id,
          link: {
            label: "Browse Articles",
            isExternal: true,
            externalUrl: "/articles",
          },
        },
      ],
      content: [
        {
          blockType: "cta",
          title: "Get Started",
          text: "Check out our latest content and stay up to date with our news.",
          link: {
            label: "View News",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          blockType: "largeFeaturedPost",
          title: "Featured Article",
          text: "Read our most popular article",
          image: mediaItems[1].id,
          link: {
            label: "Read here",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          blockType: "smallFeaturedPostsWrapper",
          posts: [
            {
              title: "Technology Trends",
              text: "Discover the latest technology trends",
              image: mediaItems[2].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 1,
                },
              },
            },
            {
              title: "Business Insights",
              text: "Expert analysis on business developments",
              image: mediaItems[3].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 2,
                },
              },
            },
            {
              title: "Science News",
              text: "Breaking discoveries in science",
              image: mediaItems[4].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 3,
                },
              },
            },
          ],
        },
        {
          blockType: "media",
          media: mediaItems[5].id,
          caption:
            "We are dedicated to bringing you the most relevant and engaging content across various fields including technology, business, and science.",
        },
        {
          blockType: "quote",
          quote: "Our mission is to deliver high-quality content that matters",
          author: "Editorial Team",
        },
        {
          blockType: "videoEmbed",
          title: "Stay Connected",
          youtubeId: "dQw4w9WgXcQ",
          description:
            "Follow us on social media and subscribe to our newsletter to stay updated with the latest content.",
        },
        {
          blockType: "linkList",
          links: [
            {
              internalUrl: {
                relationTo: "articles",
                value: 1,
              },
            },
            {
              isExternal: true,
              externalUrl: "/news",
            },
            {
              isExternal: true,
              externalUrl: "/contact",
            },
          ],
        },
        {
          blockType: "contacts",
          contacts: [mediaItems[7].id, mediaItems[8].id, mediaItems[9].id],
        },
      ],
    },
  });
  payload.logger.info("— Creating main menu...");
  await payload.updateGlobal({
    slug: "main-menu",
    data: {
      items: [
        {
          label: "Articles",
          addLinks: true,
          children: [
            {
              label: "Technology",
              addLinks: true,
              grandchildren: [
                {
                  label: "Technology",
                  link: {
                    label: "Technology",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Business",
                  link: {
                    label: "Business",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Science",
                  link: {
                    label: "Science",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
            {
              label: "Commerce",
              addLinks: true,
              grandchildren: [
                {
                  label: "Retail  ",
                  link: {
                    label: "Retail",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Wholesale",
                  link: {
                    label: "Wholesale",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Distribution",
                  link: {
                    label: "Distribution",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
            {
              label: "Services",
              addLinks: true,
              grandchildren: [
                {
                  label: "Consulting",
                  link: {
                    label: "Consulting",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Training",
                  link: {
                    label: "Training",
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "News",
          link: {
            label: "News",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          label: "Contact",
          link: {
            label: "Contact",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          label: "Blog",
          link: {
            label: "Read our blog",
            isExternal: true,
            externalUrl: "#",
          },
        },
      ],
    },
  });

  payload.logger.info("— Creating footer menu...");
  await payload.updateGlobal({
    slug: "footer-menu",
    data: {
      items: [
        {
          label: "Company",
          children: [
            {
              link: {
                label: "About Us",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Contact",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Careers",
                isExternal: true,
                externalUrl: "#",
              },
            },
          ],
        },
        {
          label: "Content",
          children: [
            {
              link: {
                label: "Articles",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "News",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Blog",
                isExternal: true,
                externalUrl: "#",
              },
            },
          ],
        },
      ],
    },
  });

  payload.logger.info("— Creating footer...");
  await payload.updateGlobal({
    slug: "footer",
    data: {
      general: {
        title: "Company Ltd",
        description: "We help companies succeed in the digital world.",
        social: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          youtube: "https://youtube.com",
        },
      },
      contact: {
        title: "Contact Information",
        address: "Example Street 123",
        postalCode: "00100",
        city: "Helsinki",
        phone: "+358 50 123 4567",
        email: "info@company.com",
      },
      copyright: "All rights reserved.",
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
