import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`front_page_blocks_hero_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`front_page_blocks_hero_locales_locale_parent_id_unique\` ON \`front_page_blocks_hero_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` DROP COLUMN \`description\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`front_page_blocks_hero_locales\`;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` ADD \`title\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`front_page_blocks_hero\` ADD \`description\` text NOT NULL;`)
}
