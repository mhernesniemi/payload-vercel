import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`front_page_blocks_cta_locales\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_quote_locales\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_articles_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_collection_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_news_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_contacts_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_rels\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`front_page_rels_locale_idx\` ON \`front_page_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_articles_id_idx\` ON \`front_page_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_collection_pages_id_idx\` ON \`front_page_rels\` (\`collection_pages_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_news_id_idx\` ON \`front_page_rels\` (\`news_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_contacts_id_idx\` ON \`front_page_rels\` (\`contacts_id\`,\`locale\`);`)
  await db.run(sql`ALTER TABLE \`contacts\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_hero_locale_idx\` ON \`front_page_blocks_hero\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` ADD \`title\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` ADD \`text\` text;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_cta_locale_idx\` ON \`front_page_blocks_cta\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_large_featured_post\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_locale_idx\` ON \`front_page_blocks_large_featured_post\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_small_featured_post\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_locale_idx\` ON \`front_page_blocks_small_featured_post\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_small_featured_posts_wrapper\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_locale_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_link_list_links\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_links_locale_idx\` ON \`front_page_blocks_link_list_links\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_link_list\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_locale_idx\` ON \`front_page_blocks_link_list\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_contacts\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_contacts_locale_idx\` ON \`front_page_blocks_contacts\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_video_embed\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_video_embed_locale_idx\` ON \`front_page_blocks_video_embed\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_media\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_media_locale_idx\` ON \`front_page_blocks_media\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` ADD \`quote\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` ADD \`author\` text;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` ADD \`title\` text;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_quote_locale_idx\` ON \`front_page_blocks_quote\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list_collections\` ADD \`locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_collections_locale_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list_items\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_items_locale_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list\` ADD \`_locale\` text NOT NULL;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_locale_idx\` ON \`front_page_blocks_dynamic_list\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`contacts_locales\` DROP COLUMN \`name\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`front_page_blocks_cta_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`front_page_blocks_cta_locales_locale_parent_id_unique\` ON \`front_page_blocks_cta_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_quote_locales\` (
  	\`quote\` text NOT NULL,
  	\`author\` text,
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_quote\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`front_page_blocks_quote_locales_locale_parent_id_unique\` ON \`front_page_blocks_quote_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_hero_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_cta_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_cta\` DROP COLUMN \`text\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_large_featured_post_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_large_featured_post\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_small_featured_post_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_small_featured_post\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_small_featured_posts_wrapper_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_small_featured_posts_wrapper\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_link_list_links_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_link_list_links\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_link_list_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_link_list\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_contacts_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_contacts\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_video_embed_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_video_embed\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_media_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_media\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_quote_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` DROP COLUMN \`quote\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` DROP COLUMN \`author\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_quote\` DROP COLUMN \`title\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_dynamic_list_collections_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list_collections\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_dynamic_list_items_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list_items\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_blocks_dynamic_list_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list\` DROP COLUMN \`_locale\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_locale_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_articles_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_collection_pages_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_news_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`front_page_rels_contacts_id_idx\`;`)
  await db.run(sql`CREATE INDEX \`front_page_rels_articles_id_idx\` ON \`front_page_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_collection_pages_id_idx\` ON \`front_page_rels\` (\`collection_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_news_id_idx\` ON \`front_page_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_contacts_id_idx\` ON \`front_page_rels\` (\`contacts_id\`);`)
  await db.run(sql`ALTER TABLE \`front_page_rels\` DROP COLUMN \`locale\`;`)
  await db.run(sql`ALTER TABLE \`contacts_locales\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`contacts\` DROP COLUMN \`name\`;`)
}
