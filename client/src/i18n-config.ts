export const i18nConfig = {
    defaultLocale: 'en',
    locales: ['en', 'nep'],
  } as const;
  
  export type Locale = (typeof i18nConfig)['locales'][number];
  