// // components/LanguageSwitcher.tsx
// 'use client'

// import { Button } from '@/components/ui/button'
// import { Globe } from 'lucide-react'
// import { useLanguage } from '@/contexts/LanguageContext'
// import { useRouter, usePathname } from 'next/navigation'
// import { useEffect } from 'react'

// export default function LanguageSwitcher() {
//   const { language, setLanguage } = useLanguage()
//   const router = useRouter()
//   const pathname = usePathname()

//   const toggleLanguage = (newLang: string) => {
//     setLanguage(newLang)
//     // Remove the current language prefix and add the new one
//     const pathWithoutLang = pathname.split('/').slice(2).join('/')
//     router.push(`/${newLang}/${pathWithoutLang}`)
//   }

//   // Update URL when language changes
//   useEffect(() => {
//     const currentLang = pathname.split('/')[1]
//     if (currentLang !== language) {
//       const pathWithoutLang = pathname.split('/').slice(2).join('/')
//       router.push(`/${language}/${pathWithoutLang}`)
//     }
//   }, [language, pathname, router])

//   return (
//     <div className="flex gap-2">
//       <Button
//         variant={language === 'en' ? 'default' : 'outline'}
//         size="sm"
//         onClick={() => toggleLanguage('en')}
//         className="flex items-center gap-2"
//       >
//         <Globe className="w-4 h-4" />
//         EN
//       </Button>
//       <Button
//         variant={language === 'nep' ? 'default' : 'outline'}
//         size="sm"
//         onClick={() => toggleLanguage('nep')}
//         className="flex items-center gap-2"
//       >
//         <Globe className="w-4 h-4" />
//         NEP
//       </Button>
//     </div>
//   )
// }


'use client';

import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // Extract the current path without language prefix
  const getCurrentPath = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
  };

  // Single effect to handle URL synchronization
  useEffect(() => {
    const urlLang = pathname.split('/')[1];
    
    // Only update if there's a valid language in the URL and it doesn't match the current language
    if (urlLang && (urlLang === 'en' || urlLang === 'nep') && urlLang !== language) {
      setLanguage(urlLang);
    }
  }, [pathname]); 

  const toggleLanguage = (newLang: string) => {
    if (language === newLang) return;
    
    const currentPath = getCurrentPath();
    const newPath = `/${newLang}/${currentPath}`;
    
    setLanguage(newLang);
    router.replace(newPath);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleLanguage('en')}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        EN
      </Button>
      <Button
        variant={language === 'nep' ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleLanguage('nep')}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        NEP
      </Button>
    </div>
  );
}

// 'use client';

// import { Button } from '@/components/ui/button';
// import { Globe } from 'lucide-react';
// import { useLanguage } from '@/contexts/LanguageContext';

// export default function LanguageSwitcher() {
//   const { language, setLanguage } = useLanguage();

//   const toggleLanguage = (newLang: string) => {
//     if (language === newLang) return;
//     setLanguage(newLang);
//   };

//   return (
//     <div className="flex gap-2">
//       <Button
//         variant={language === 'en' ? 'default' : 'outline'}
//         size="sm"
//         onClick={() => toggleLanguage('en')}
//         className="flex items-center gap-2"
//       >
//         <Globe className="w-4 h-4" />
//         EN
//       </Button>
//       <Button
//         variant={language === 'nep' ? 'default' : 'outline'}
//         size="sm"
//         onClick={() => toggleLanguage('nep')}
//         className="flex items-center gap-2"
//       >
//         <Globe className="w-4 h-4" />
//         NEP
//       </Button>
//     </div>
//   );
// }
