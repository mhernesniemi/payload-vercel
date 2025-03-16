import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'user' NOT NULL,
  	\`google_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`created_by_id\` integer,
  	\`sticky\` integer,
  	\`author_id\` integer,
  	\`published_date\` text,
  	\`collection\` text DEFAULT 'articles',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_by_idx\` ON \`articles\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_author_idx\` ON \`articles\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articles_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_image_idx\` ON \`articles_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`articles_meta_meta_image_idx\` ON \`articles_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_categories_id_idx\` ON \`articles_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_created_by_id\` integer,
  	\`version_sticky\` integer,
  	\`version_author_id\` integer,
  	\`version_published_date\` text,
  	\`version_collection\` text DEFAULT 'articles',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_by_idx\` ON \`_articles_v\` (\`version_created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_author_idx\` ON \`_articles_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_snapshot_idx\` ON \`_articles_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_published_locale_idx\` ON \`_articles_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_locales\` (
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_image_id\` integer,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_image_idx\` ON \`_articles_v_locales\` (\`version_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_meta_version_meta_image_idx\` ON \`_articles_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_articles_v_locales_locale_parent_id_unique\` ON \`_articles_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_categories_id_idx\` ON \`_articles_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`collection_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`created_by_id\` integer,
  	\`sticky\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`collection_pages_slug_idx\` ON \`collection_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`collection_pages_created_by_idx\` ON \`collection_pages\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`collection_pages_updated_at_idx\` ON \`collection_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`collection_pages_created_at_idx\` ON \`collection_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`collection_pages_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`collection_pages_image_idx\` ON \`collection_pages_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`collection_pages_locales_locale_parent_id_unique\` ON \`collection_pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`created_by_id\` integer,
  	\`sticky\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`news_created_by_idx\` ON \`news\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`news_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_image_idx\` ON \`news_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`news_meta_meta_image_idx\` ON \`news_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`news_locales_locale_parent_id_unique\` ON \`news_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`categories_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`doc_id\` integer,
  	\`url\` text,
  	\`label\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`categories_breadcrumbs_order_idx\` ON \`categories_breadcrumbs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`categories_breadcrumbs_parent_id_idx\` ON \`categories_breadcrumbs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_breadcrumbs_locale_idx\` ON \`categories_breadcrumbs\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`categories_breadcrumbs_doc_idx\` ON \`categories_breadcrumbs\` (\`doc_id\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`parent_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_parent_idx\` ON \`categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`categories_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_locales_locale_parent_id_unique\` ON \`categories_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contacts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`image_id\` integer,
  	\`order\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`contacts_image_idx\` ON \`contacts\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`contacts_updated_at_idx\` ON \`contacts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`contacts_created_at_idx\` ON \`contacts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`contacts_locales\` (
  	\`name\` text NOT NULL,
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`contacts_locales_locale_parent_id_unique\` ON \`contacts_locales\` (\`_locale\`,\`_parent_id\`);`)
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
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`articles_id\` integer,
  	\`collection_pages_id\` integer,
  	\`news_id\` integer,
  	\`categories_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`collection_pages_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_collection_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`collection_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contacts_id_idx\` ON \`payload_locked_documents_rels\` (\`contacts_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_type\` text DEFAULT 'hero' NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_hero_order_idx\` ON \`front_page_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_hero_parent_id_idx\` ON \`front_page_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_hero_path_idx\` ON \`front_page_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_hero_image_idx\` ON \`front_page_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_cta_order_idx\` ON \`front_page_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_cta_parent_id_idx\` ON \`front_page_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_cta_path_idx\` ON \`front_page_blocks_cta\` (\`_path\`);`)
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
  await db.run(sql`CREATE TABLE \`front_page_blocks_large_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer NOT NULL,
  	\`video\` text,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_order_idx\` ON \`front_page_blocks_large_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_parent_id_idx\` ON \`front_page_blocks_large_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_path_idx\` ON \`front_page_blocks_large_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_large_featured_post_image_idx\` ON \`front_page_blocks_large_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_small_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer NOT NULL,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_order_idx\` ON \`front_page_blocks_small_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_parent_id_idx\` ON \`front_page_blocks_small_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_path_idx\` ON \`front_page_blocks_small_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_image_idx\` ON \`front_page_blocks_small_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_small_featured_posts_wrapper\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_order_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_parent_id_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_path_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_link_list_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`is_external\` integer,
  	\`external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_link_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_links_order_idx\` ON \`front_page_blocks_link_list_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_links_parent_id_idx\` ON \`front_page_blocks_link_list_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_link_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_order_idx\` ON \`front_page_blocks_link_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_parent_id_idx\` ON \`front_page_blocks_link_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_link_list_path_idx\` ON \`front_page_blocks_link_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_contacts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_contacts_order_idx\` ON \`front_page_blocks_contacts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_contacts_parent_id_idx\` ON \`front_page_blocks_contacts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_contacts_path_idx\` ON \`front_page_blocks_contacts\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_video_embed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`youtube_id\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_video_embed_order_idx\` ON \`front_page_blocks_video_embed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_video_embed_parent_id_idx\` ON \`front_page_blocks_video_embed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_video_embed_path_idx\` ON \`front_page_blocks_video_embed\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer NOT NULL,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_media_order_idx\` ON \`front_page_blocks_media\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_media_parent_id_idx\` ON \`front_page_blocks_media\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_media_path_idx\` ON \`front_page_blocks_media\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_media_media_idx\` ON \`front_page_blocks_media\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_quote_order_idx\` ON \`front_page_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_quote_parent_id_idx\` ON \`front_page_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_quote_path_idx\` ON \`front_page_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_quote_image_idx\` ON \`front_page_blocks_quote\` (\`image_id\`);`)
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
  await db.run(sql`CREATE TABLE \`front_page_blocks_dynamic_list_collections\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`front_page_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_collections_order_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_collections_parent_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_dynamic_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_items_order_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_items_parent_id_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_blocks_dynamic_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sort_by\` text DEFAULT 'createdAt' NOT NULL,
  	\`sort_order\` text DEFAULT 'desc' NOT NULL,
  	\`limit\` numeric DEFAULT 3 NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_order_idx\` ON \`front_page_blocks_dynamic_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_parent_id_idx\` ON \`front_page_blocks_dynamic_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_dynamic_list_path_idx\` ON \`front_page_blocks_dynamic_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`front_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`front_page_locales\` (
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_meta_meta_image_idx\` ON \`front_page_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`front_page_locales_locale_parent_id_unique\` ON \`front_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`front_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`collection_pages_id\` integer,
  	\`news_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`collection_pages_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_rels_order_idx\` ON \`front_page_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_parent_idx\` ON \`front_page_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_path_idx\` ON \`front_page_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_articles_id_idx\` ON \`front_page_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_collection_pages_id_idx\` ON \`front_page_rels\` (\`collection_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_news_id_idx\` ON \`front_page_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_rels_contacts_id_idx\` ON \`front_page_rels\` (\`contacts_id\`);`)
  await db.run(sql`CREATE TABLE \`main_menu_items_children_grandchildren\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu_items_children\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_grandchildren_order_idx\` ON \`main_menu_items_children_grandchildren\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_grandchildren_parent_id_idx\` ON \`main_menu_items_children_grandchildren\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_grandchildren_locale_idx\` ON \`main_menu_items_children_grandchildren\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`main_menu_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`add_links\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_order_idx\` ON \`main_menu_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_parent_id_idx\` ON \`main_menu_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_children_locale_idx\` ON \`main_menu_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`main_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`add_links\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_items_order_idx\` ON \`main_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_parent_id_idx\` ON \`main_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_locale_idx\` ON \`main_menu_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`main_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`main_menu_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	\`collection_pages_id\` integer,
  	\`news_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`collection_pages_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_rels_order_idx\` ON \`main_menu_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_parent_idx\` ON \`main_menu_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_path_idx\` ON \`main_menu_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_locale_idx\` ON \`main_menu_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_articles_id_idx\` ON \`main_menu_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_collection_pages_id_idx\` ON \`main_menu_rels\` (\`collection_pages_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_news_id_idx\` ON \`main_menu_rels\` (\`news_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE \`footer_menu_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_menu_items_children_order_idx\` ON \`footer_menu_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_children_parent_id_idx\` ON \`footer_menu_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_children_locale_idx\` ON \`footer_menu_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`footer_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_menu_items_order_idx\` ON \`footer_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_parent_id_idx\` ON \`footer_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_locale_idx\` ON \`footer_menu_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`footer_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`footer_menu_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	\`collection_pages_id\` integer,
  	\`news_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`footer_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`collection_pages_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_order_idx\` ON \`footer_menu_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_parent_idx\` ON \`footer_menu_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_path_idx\` ON \`footer_menu_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_locale_idx\` ON \`footer_menu_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_articles_id_idx\` ON \`footer_menu_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_collection_pages_id_idx\` ON \`footer_menu_rels\` (\`collection_pages_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_rels_news_id_idx\` ON \`footer_menu_rels\` (\`news_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`footer_locales\` (
  	\`general_title\` text,
  	\`general_description\` text,
  	\`general_social_facebook\` text,
  	\`general_social_instagram\` text,
  	\`general_social_linkedin\` text,
  	\`general_social_youtube\` text,
  	\`contact_title\` text,
  	\`contact_address\` text,
  	\`contact_postal_code\` text,
  	\`contact_city\` text,
  	\`contact_phone\` text,
  	\`contact_email\` text,
  	\`copyright\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`footer_locales_locale_parent_id_unique\` ON \`footer_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_locales\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`collection_pages\`;`)
  await db.run(sql`DROP TABLE \`collection_pages_locales\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`news_locales\`;`)
  await db.run(sql`DROP TABLE \`categories_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`categories_locales\`;`)
  await db.run(sql`DROP TABLE \`contacts\`;`)
  await db.run(sql`DROP TABLE \`contacts_locales\`;`)
  await db.run(sql`DROP TABLE \`contacts_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_cta_locales\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_posts_wrapper\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_link_list_links\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_link_list\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_contacts\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_video_embed\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_media\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_quote_locales\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list_collections\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list_items\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list\`;`)
  await db.run(sql`DROP TABLE \`front_page\`;`)
  await db.run(sql`DROP TABLE \`front_page_locales\`;`)
  await db.run(sql`DROP TABLE \`front_page_rels\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items_children_grandchildren\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items_children\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items\`;`)
  await db.run(sql`DROP TABLE \`main_menu\`;`)
  await db.run(sql`DROP TABLE \`main_menu_rels\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_items_children\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_items\`;`)
  await db.run(sql`DROP TABLE \`footer_menu\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_rels\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer_locales\`;`)
}
