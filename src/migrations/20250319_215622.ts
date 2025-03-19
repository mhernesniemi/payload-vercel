import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`main_menu_items_children_grandchildren\` DROP COLUMN \`link_label\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_items_children\` DROP COLUMN \`link_label\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_items\` DROP COLUMN \`link_label\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`main_menu_items_children_grandchildren\` ADD \`link_label\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_items_children\` ADD \`link_label\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_items\` ADD \`link_label\` text;`)
}
