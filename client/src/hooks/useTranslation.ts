// hooks/useTranslation.ts
'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key: keyof typeof translations.en) => {
    return translations[language as keyof typeof translations][key]
  }

  return { t, language }
}