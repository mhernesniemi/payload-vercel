import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`contacts_rels\`;`)
  await db.run(sql`ALTER TABLE \`contacts\` ADD \`name\` text NOT NULL DEFAULT '';`)
  await db.run(sql`ALTER TABLE \`contacts\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`contacts_locales\` DROP COLUMN \`name\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`contacts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contacts_rels_order_idx\` ON \`contacts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`contacts_rels_parent_idx\` ON \`contacts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contacts_rels_path_idx\` ON \`contacts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`contacts_rels_categories_id_idx\` ON \`contacts_rels\` (\`categories_id\`);`)
  await db.run(sql`ALTER TABLE \`contacts\` ADD \`order\` numeric;`)
  await db.run(sql`ALTER TABLE \`contacts\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`contacts_locales\` ADD \`name\` text NOT NULL;`)
}
