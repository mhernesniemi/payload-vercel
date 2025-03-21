import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_front_page_blocks_large_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_front_page_blocks_large_featured_post\`("_order", "_parent_id", "_path", "_locale", "id", "title", "text", "image_id", "link_label", "link_is_external", "link_external_url", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "title", "text", "image_id", "link_label", "link_is_external", "link_external_url", "block_name" FROM \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`ALTER TABLE \`__new_front_page_blocks_large_featured_post\` RENAME TO \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_order_idx\` ON \`front_page_blocks_large_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_parent_id_idx\` ON \`front_page_blocks_large_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_path_idx\` ON \`front_page_blocks_large_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_locale_idx\` ON \`front_page_blocks_large_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_image_idx\` ON \`front_page_blocks_large_featured_post\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list\` ADD \`language\` text DEFAULT 'fi' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_front_page_blocks_large_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer NOT NULL,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_front_page_blocks_large_featured_post\`("_order", "_parent_id", "_path", "_locale", "id", "title", "text", "image_id", "link_label", "link_is_external", "link_external_url", "block_name") SELECT "_order", "_parent_id", "_path", "_locale", "id", "title", "text", "image_id", "link_label", "link_is_external", "link_external_url", "block_name" FROM \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`ALTER TABLE \`__new_front_page_blocks_large_featured_post\` RENAME TO \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_order_idx\` ON \`front_page_blocks_large_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_parent_id_idx\` ON \`front_page_blocks_large_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_path_idx\` ON \`front_page_blocks_large_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_locale_idx\` ON \`front_page_blocks_large_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_image_idx\` ON \`front_page_blocks_large_featured_post\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_dynamic_list\` DROP COLUMN \`language\`;`)
}
