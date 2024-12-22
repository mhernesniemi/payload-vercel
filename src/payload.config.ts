// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { FrontPage } from './globals/FrontPage'
import { Articles } from './collections/Articles'
import { MainMenu } from './globals/MainMenu'
import { CollectionPage } from './collections/CollectionPage'
import { News } from './collections/News'
import { Reference } from './collections/Reference'
import { Categories } from './collections/Categories'
import { Contacts } from './collections/Contacts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
    dateFormat: 'dd.MM.yyyy',
  },
  collections: [Users, Media, Articles, CollectionPage, News, Reference, Categories, Contacts],
  globals: [FrontPage, MainMenu],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: ['fi', 'en'],
    defaultLocale: 'fi',
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
