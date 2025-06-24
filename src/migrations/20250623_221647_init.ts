import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_front_page_blocks_dynamic_list_collections" AS ENUM('articles', 'news', 'collection-pages', 'contacts');
  CREATE TYPE "public"."enum_front_page_blocks_dynamic_list_language" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_front_page_blocks_dynamic_list_sort_by" AS ENUM('createdAt', 'updatedAt', 'publishedDate');
  CREATE TYPE "public"."enum_front_page_blocks_dynamic_list_sort_order" AS ENUM('asc', 'desc');
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"google_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_tiny_url" varchar,
  	"sizes_tiny_width" numeric,
  	"sizes_tiny_height" numeric,
  	"sizes_tiny_mime_type" varchar,
  	"sizes_tiny_filesize" numeric,
  	"sizes_tiny_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"created_by_id" integer,
  	"sticky" boolean,
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"collection" varchar DEFAULT 'articles',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_created_by_id" integer,
  	"version_sticky" boolean,
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_collection" varchar DEFAULT 'articles',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "collection_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"created_by_id" integer,
  	"sticky" boolean,
  	"collection" varchar DEFAULT 'collection-pages',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "collection_pages_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"created_by_id" integer,
  	"sticky" boolean,
  	"collection" varchar DEFAULT 'news',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contacts_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"articles_id" integer,
  	"collection_pages_id" integer,
  	"news_id" integer,
  	"categories_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "front_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_type" varchar DEFAULT 'hero' NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"link_label" varchar,
  	"link_is_external" boolean,
  	"link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_is_external" boolean,
  	"link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_large_featured_post" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_is_external" boolean,
  	"link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_small_featured_post" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer NOT NULL,
  	"link_is_external" boolean,
  	"link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_small_featured_posts_wrapper" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"is_external" boolean,
  	"external_url" varchar
  );
  
  CREATE TABLE "front_page_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_id" varchar NOT NULL,
  	"alt" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page_blocks_dynamic_list_collections" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_front_page_blocks_dynamic_list_collections",
  	"locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "front_page_blocks_dynamic_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "front_page_blocks_dynamic_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_front_page_blocks_dynamic_list_language" DEFAULT 'fi' NOT NULL,
  	"sort_by" "enum_front_page_blocks_dynamic_list_sort_by" DEFAULT 'createdAt' NOT NULL,
  	"sort_order" "enum_front_page_blocks_dynamic_list_sort_order" DEFAULT 'desc' NOT NULL,
  	"limit" numeric DEFAULT 3 NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "front_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "front_page_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "front_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"articles_id" integer,
  	"collection_pages_id" integer,
  	"news_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "main_menu_items_children_grandchildren" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_is_external" boolean,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "main_menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"add_links" boolean,
  	"link_is_external" boolean,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "main_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"add_links" boolean,
  	"link_is_external" boolean,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_menu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"articles_id" integer,
  	"collection_pages_id" integer,
  	"news_id" integer
  );
  
  CREATE TABLE "footer_menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_is_external" boolean,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "footer_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_menu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"articles_id" integer,
  	"collection_pages_id" integer,
  	"news_id" integer
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"general_social_facebook" varchar,
  	"general_social_instagram" varchar,
  	"general_social_linkedin" varchar,
  	"general_social_youtube" varchar,
  	"contact_title" varchar,
  	"contact_address" varchar,
  	"contact_postal_code" varchar,
  	"contact_city" varchar,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"general_title" varchar,
  	"general_description" varchar,
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_contacts_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_contacts_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_pages_locales" ADD CONSTRAINT "collection_pages_locales_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_pages_locales" ADD CONSTRAINT "collection_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_locales" ADD CONSTRAINT "contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collection_pages_fk" FOREIGN KEY ("collection_pages_id") REFERENCES "public"."collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_hero" ADD CONSTRAINT "front_page_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_blocks_hero" ADD CONSTRAINT "front_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_cta" ADD CONSTRAINT "front_page_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_large_featured_post" ADD CONSTRAINT "front_page_blocks_large_featured_post_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_blocks_large_featured_post" ADD CONSTRAINT "front_page_blocks_large_featured_post_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_small_featured_post" ADD CONSTRAINT "front_page_blocks_small_featured_post_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_blocks_small_featured_post" ADD CONSTRAINT "front_page_blocks_small_featured_post_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_small_featured_posts_wrapper" ADD CONSTRAINT "front_page_blocks_small_featured_posts_wrapper_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_link_list_links" ADD CONSTRAINT "front_page_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_link_list" ADD CONSTRAINT "front_page_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_contacts" ADD CONSTRAINT "front_page_blocks_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_video_embed" ADD CONSTRAINT "front_page_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_media" ADD CONSTRAINT "front_page_blocks_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_blocks_media" ADD CONSTRAINT "front_page_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_quote" ADD CONSTRAINT "front_page_blocks_quote_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_blocks_quote" ADD CONSTRAINT "front_page_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_dynamic_list_collections" ADD CONSTRAINT "front_page_blocks_dynamic_list_collections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."front_page_blocks_dynamic_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_dynamic_list_items" ADD CONSTRAINT "front_page_blocks_dynamic_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page_blocks_dynamic_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_blocks_dynamic_list" ADD CONSTRAINT "front_page_blocks_dynamic_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_locales" ADD CONSTRAINT "front_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "front_page_locales" ADD CONSTRAINT "front_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_rels" ADD CONSTRAINT "front_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."front_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_rels" ADD CONSTRAINT "front_page_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_rels" ADD CONSTRAINT "front_page_rels_collection_pages_fk" FOREIGN KEY ("collection_pages_id") REFERENCES "public"."collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_rels" ADD CONSTRAINT "front_page_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "front_page_rels" ADD CONSTRAINT "front_page_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_items_children_grandchildren" ADD CONSTRAINT "main_menu_items_children_grandchildren_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_items_children" ADD CONSTRAINT "main_menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_items" ADD CONSTRAINT "main_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_collection_pages_fk" FOREIGN KEY ("collection_pages_id") REFERENCES "public"."collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_items_children" ADD CONSTRAINT "footer_menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_items" ADD CONSTRAINT "footer_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_rels" ADD CONSTRAINT "footer_menu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_rels" ADD CONSTRAINT "footer_menu_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_rels" ADD CONSTRAINT "footer_menu_rels_collection_pages_fk" FOREIGN KEY ("collection_pages_id") REFERENCES "public"."collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_rels" ADD CONSTRAINT "footer_menu_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_tiny_sizes_tiny_filename_idx" ON "media" USING btree ("sizes_tiny_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_created_by_idx" ON "articles" USING btree ("created_by_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_image_idx" ON "articles_locales" USING btree ("image_id","_locale");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_categories_id_idx" ON "articles_rels" USING btree ("categories_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_created_by_idx" ON "_articles_v" USING btree ("version_created_by_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_version_version_image_idx" ON "_articles_v_locales" USING btree ("version_image_id","_locale");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_categories_id_idx" ON "_articles_v_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "collection_pages_slug_idx" ON "collection_pages" USING btree ("slug");
  CREATE INDEX "collection_pages_created_by_idx" ON "collection_pages" USING btree ("created_by_id");
  CREATE INDEX "collection_pages_updated_at_idx" ON "collection_pages" USING btree ("updated_at");
  CREATE INDEX "collection_pages_created_at_idx" ON "collection_pages" USING btree ("created_at");
  CREATE INDEX "collection_pages_image_idx" ON "collection_pages_locales" USING btree ("image_id","_locale");
  CREATE UNIQUE INDEX "collection_pages_locales_locale_parent_id_unique" ON "collection_pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_created_by_idx" ON "news" USING btree ("created_by_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news_image_idx" ON "news_locales" USING btree ("image_id","_locale");
  CREATE INDEX "news_meta_meta_image_idx" ON "news_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contacts_image_idx" ON "contacts" USING btree ("image_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE UNIQUE INDEX "contacts_locales_locale_parent_id_unique" ON "contacts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_collection_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("collection_pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "front_page_blocks_hero_order_idx" ON "front_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "front_page_blocks_hero_parent_id_idx" ON "front_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_hero_path_idx" ON "front_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "front_page_blocks_hero_locale_idx" ON "front_page_blocks_hero" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_hero_image_idx" ON "front_page_blocks_hero" USING btree ("image_id");
  CREATE INDEX "front_page_blocks_cta_order_idx" ON "front_page_blocks_cta" USING btree ("_order");
  CREATE INDEX "front_page_blocks_cta_parent_id_idx" ON "front_page_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_cta_path_idx" ON "front_page_blocks_cta" USING btree ("_path");
  CREATE INDEX "front_page_blocks_cta_locale_idx" ON "front_page_blocks_cta" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_large_featured_post_order_idx" ON "front_page_blocks_large_featured_post" USING btree ("_order");
  CREATE INDEX "front_page_blocks_large_featured_post_parent_id_idx" ON "front_page_blocks_large_featured_post" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_large_featured_post_path_idx" ON "front_page_blocks_large_featured_post" USING btree ("_path");
  CREATE INDEX "front_page_blocks_large_featured_post_locale_idx" ON "front_page_blocks_large_featured_post" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_large_featured_post_image_idx" ON "front_page_blocks_large_featured_post" USING btree ("image_id");
  CREATE INDEX "front_page_blocks_small_featured_post_order_idx" ON "front_page_blocks_small_featured_post" USING btree ("_order");
  CREATE INDEX "front_page_blocks_small_featured_post_parent_id_idx" ON "front_page_blocks_small_featured_post" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_small_featured_post_path_idx" ON "front_page_blocks_small_featured_post" USING btree ("_path");
  CREATE INDEX "front_page_blocks_small_featured_post_locale_idx" ON "front_page_blocks_small_featured_post" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_small_featured_post_image_idx" ON "front_page_blocks_small_featured_post" USING btree ("image_id");
  CREATE INDEX "front_page_blocks_small_featured_posts_wrapper_order_idx" ON "front_page_blocks_small_featured_posts_wrapper" USING btree ("_order");
  CREATE INDEX "front_page_blocks_small_featured_posts_wrapper_parent_id_idx" ON "front_page_blocks_small_featured_posts_wrapper" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_small_featured_posts_wrapper_path_idx" ON "front_page_blocks_small_featured_posts_wrapper" USING btree ("_path");
  CREATE INDEX "front_page_blocks_small_featured_posts_wrapper_locale_idx" ON "front_page_blocks_small_featured_posts_wrapper" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_link_list_links_order_idx" ON "front_page_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "front_page_blocks_link_list_links_parent_id_idx" ON "front_page_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_link_list_links_locale_idx" ON "front_page_blocks_link_list_links" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_link_list_order_idx" ON "front_page_blocks_link_list" USING btree ("_order");
  CREATE INDEX "front_page_blocks_link_list_parent_id_idx" ON "front_page_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_link_list_path_idx" ON "front_page_blocks_link_list" USING btree ("_path");
  CREATE INDEX "front_page_blocks_link_list_locale_idx" ON "front_page_blocks_link_list" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_contacts_order_idx" ON "front_page_blocks_contacts" USING btree ("_order");
  CREATE INDEX "front_page_blocks_contacts_parent_id_idx" ON "front_page_blocks_contacts" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_contacts_path_idx" ON "front_page_blocks_contacts" USING btree ("_path");
  CREATE INDEX "front_page_blocks_contacts_locale_idx" ON "front_page_blocks_contacts" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_video_embed_order_idx" ON "front_page_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "front_page_blocks_video_embed_parent_id_idx" ON "front_page_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_video_embed_path_idx" ON "front_page_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "front_page_blocks_video_embed_locale_idx" ON "front_page_blocks_video_embed" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_media_order_idx" ON "front_page_blocks_media" USING btree ("_order");
  CREATE INDEX "front_page_blocks_media_parent_id_idx" ON "front_page_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_media_path_idx" ON "front_page_blocks_media" USING btree ("_path");
  CREATE INDEX "front_page_blocks_media_locale_idx" ON "front_page_blocks_media" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_media_media_idx" ON "front_page_blocks_media" USING btree ("media_id");
  CREATE INDEX "front_page_blocks_quote_order_idx" ON "front_page_blocks_quote" USING btree ("_order");
  CREATE INDEX "front_page_blocks_quote_parent_id_idx" ON "front_page_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_quote_path_idx" ON "front_page_blocks_quote" USING btree ("_path");
  CREATE INDEX "front_page_blocks_quote_locale_idx" ON "front_page_blocks_quote" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_quote_image_idx" ON "front_page_blocks_quote" USING btree ("image_id");
  CREATE INDEX "front_page_blocks_dynamic_list_collections_order_idx" ON "front_page_blocks_dynamic_list_collections" USING btree ("order");
  CREATE INDEX "front_page_blocks_dynamic_list_collections_parent_idx" ON "front_page_blocks_dynamic_list_collections" USING btree ("parent_id");
  CREATE INDEX "front_page_blocks_dynamic_list_collections_locale_idx" ON "front_page_blocks_dynamic_list_collections" USING btree ("locale");
  CREATE INDEX "front_page_blocks_dynamic_list_items_order_idx" ON "front_page_blocks_dynamic_list_items" USING btree ("_order");
  CREATE INDEX "front_page_blocks_dynamic_list_items_parent_id_idx" ON "front_page_blocks_dynamic_list_items" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_dynamic_list_items_locale_idx" ON "front_page_blocks_dynamic_list_items" USING btree ("_locale");
  CREATE INDEX "front_page_blocks_dynamic_list_order_idx" ON "front_page_blocks_dynamic_list" USING btree ("_order");
  CREATE INDEX "front_page_blocks_dynamic_list_parent_id_idx" ON "front_page_blocks_dynamic_list" USING btree ("_parent_id");
  CREATE INDEX "front_page_blocks_dynamic_list_path_idx" ON "front_page_blocks_dynamic_list" USING btree ("_path");
  CREATE INDEX "front_page_blocks_dynamic_list_locale_idx" ON "front_page_blocks_dynamic_list" USING btree ("_locale");
  CREATE INDEX "front_page_meta_meta_image_idx" ON "front_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "front_page_locales_locale_parent_id_unique" ON "front_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "front_page_rels_order_idx" ON "front_page_rels" USING btree ("order");
  CREATE INDEX "front_page_rels_parent_idx" ON "front_page_rels" USING btree ("parent_id");
  CREATE INDEX "front_page_rels_path_idx" ON "front_page_rels" USING btree ("path");
  CREATE INDEX "front_page_rels_locale_idx" ON "front_page_rels" USING btree ("locale");
  CREATE INDEX "front_page_rels_articles_id_idx" ON "front_page_rels" USING btree ("articles_id","locale");
  CREATE INDEX "front_page_rels_collection_pages_id_idx" ON "front_page_rels" USING btree ("collection_pages_id","locale");
  CREATE INDEX "front_page_rels_news_id_idx" ON "front_page_rels" USING btree ("news_id","locale");
  CREATE INDEX "front_page_rels_contacts_id_idx" ON "front_page_rels" USING btree ("contacts_id","locale");
  CREATE INDEX "main_menu_items_children_grandchildren_order_idx" ON "main_menu_items_children_grandchildren" USING btree ("_order");
  CREATE INDEX "main_menu_items_children_grandchildren_parent_id_idx" ON "main_menu_items_children_grandchildren" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_children_grandchildren_locale_idx" ON "main_menu_items_children_grandchildren" USING btree ("_locale");
  CREATE INDEX "main_menu_items_children_order_idx" ON "main_menu_items_children" USING btree ("_order");
  CREATE INDEX "main_menu_items_children_parent_id_idx" ON "main_menu_items_children" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_children_locale_idx" ON "main_menu_items_children" USING btree ("_locale");
  CREATE INDEX "main_menu_items_order_idx" ON "main_menu_items" USING btree ("_order");
  CREATE INDEX "main_menu_items_parent_id_idx" ON "main_menu_items" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_locale_idx" ON "main_menu_items" USING btree ("_locale");
  CREATE INDEX "main_menu_rels_order_idx" ON "main_menu_rels" USING btree ("order");
  CREATE INDEX "main_menu_rels_parent_idx" ON "main_menu_rels" USING btree ("parent_id");
  CREATE INDEX "main_menu_rels_path_idx" ON "main_menu_rels" USING btree ("path");
  CREATE INDEX "main_menu_rels_locale_idx" ON "main_menu_rels" USING btree ("locale");
  CREATE INDEX "main_menu_rels_articles_id_idx" ON "main_menu_rels" USING btree ("articles_id","locale");
  CREATE INDEX "main_menu_rels_collection_pages_id_idx" ON "main_menu_rels" USING btree ("collection_pages_id","locale");
  CREATE INDEX "main_menu_rels_news_id_idx" ON "main_menu_rels" USING btree ("news_id","locale");
  CREATE INDEX "footer_menu_items_children_order_idx" ON "footer_menu_items_children" USING btree ("_order");
  CREATE INDEX "footer_menu_items_children_parent_id_idx" ON "footer_menu_items_children" USING btree ("_parent_id");
  CREATE INDEX "footer_menu_items_children_locale_idx" ON "footer_menu_items_children" USING btree ("_locale");
  CREATE INDEX "footer_menu_items_order_idx" ON "footer_menu_items" USING btree ("_order");
  CREATE INDEX "footer_menu_items_parent_id_idx" ON "footer_menu_items" USING btree ("_parent_id");
  CREATE INDEX "footer_menu_items_locale_idx" ON "footer_menu_items" USING btree ("_locale");
  CREATE INDEX "footer_menu_rels_order_idx" ON "footer_menu_rels" USING btree ("order");
  CREATE INDEX "footer_menu_rels_parent_idx" ON "footer_menu_rels" USING btree ("parent_id");
  CREATE INDEX "footer_menu_rels_path_idx" ON "footer_menu_rels" USING btree ("path");
  CREATE INDEX "footer_menu_rels_locale_idx" ON "footer_menu_rels" USING btree ("locale");
  CREATE INDEX "footer_menu_rels_articles_id_idx" ON "footer_menu_rels" USING btree ("articles_id","locale");
  CREATE INDEX "footer_menu_rels_collection_pages_id_idx" ON "footer_menu_rels" USING btree ("collection_pages_id","locale");
  CREATE INDEX "footer_menu_rels_news_id_idx" ON "footer_menu_rels" USING btree ("news_id","locale");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "collection_pages" CASCADE;
  DROP TABLE "collection_pages_locales" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "contacts_locales" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "front_page_blocks_hero" CASCADE;
  DROP TABLE "front_page_blocks_cta" CASCADE;
  DROP TABLE "front_page_blocks_large_featured_post" CASCADE;
  DROP TABLE "front_page_blocks_small_featured_post" CASCADE;
  DROP TABLE "front_page_blocks_small_featured_posts_wrapper" CASCADE;
  DROP TABLE "front_page_blocks_link_list_links" CASCADE;
  DROP TABLE "front_page_blocks_link_list" CASCADE;
  DROP TABLE "front_page_blocks_contacts" CASCADE;
  DROP TABLE "front_page_blocks_video_embed" CASCADE;
  DROP TABLE "front_page_blocks_media" CASCADE;
  DROP TABLE "front_page_blocks_quote" CASCADE;
  DROP TABLE "front_page_blocks_dynamic_list_collections" CASCADE;
  DROP TABLE "front_page_blocks_dynamic_list_items" CASCADE;
  DROP TABLE "front_page_blocks_dynamic_list" CASCADE;
  DROP TABLE "front_page" CASCADE;
  DROP TABLE "front_page_locales" CASCADE;
  DROP TABLE "front_page_rels" CASCADE;
  DROP TABLE "main_menu_items_children_grandchildren" CASCADE;
  DROP TABLE "main_menu_items_children" CASCADE;
  DROP TABLE "main_menu_items" CASCADE;
  DROP TABLE "main_menu" CASCADE;
  DROP TABLE "main_menu_rels" CASCADE;
  DROP TABLE "footer_menu_items_children" CASCADE;
  DROP TABLE "footer_menu_items" CASCADE;
  DROP TABLE "footer_menu" CASCADE;
  DROP TABLE "footer_menu_rels" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_front_page_blocks_dynamic_list_collections";
  DROP TYPE "public"."enum_front_page_blocks_dynamic_list_language";
  DROP TYPE "public"."enum_front_page_blocks_dynamic_list_sort_by";
  DROP TYPE "public"."enum_front_page_blocks_dynamic_list_sort_order";`)
}
