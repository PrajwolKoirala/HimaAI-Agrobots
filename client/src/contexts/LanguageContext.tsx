// // contexts/LanguageContext.tsx
// 'use client'

// import React, { createContext, useContext, useState, useEffect } from 'react';

// type LanguageContextType = {
//   language: string;
//   setLanguage: (lang: string) => void;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export function LanguageProvider({ children }: { children: React.ReactNode }) {
//   const [language, setLanguage] = useState('en');

//   // Load saved language preference on mount
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('preferred-language');
//     if (savedLanguage) {
//       setLanguage(savedLanguage);
//     }
//   }, []);

//   // Save language preference when it changes
//   const handleSetLanguage = (newLang: string) => {
//     setLanguage(newLang);
//     localStorage.setItem('preferred-language', newLang);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// }


'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');
  const router = useRouter();
  const pathname = usePathname();

  // Initialize language from URL on mount
  useEffect(() => {
    const urlLang = pathname.split('/')[1];
    if (urlLang === 'en' || urlLang === 'nep') {
      setLanguage(urlLang);
      localStorage.setItem('preferred-language', urlLang);
    }
  }, []);

  const handleSetLanguage = (newLang: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    const newPath = `/${newLang}/${currentPath}`;
    
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
    router.replace(newPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}