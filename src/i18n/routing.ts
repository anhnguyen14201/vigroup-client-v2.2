//src/i18n/routing.ts

import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['vi', 'cs', 'en'],

  // Used when no locale matches
  defaultLocale: 'vi',
  localePrefix: 'always',
  localeDetection: false,
})

export type Locale = (typeof routing)['locales'][number] // 'vi' | 'cs' | 'en'
