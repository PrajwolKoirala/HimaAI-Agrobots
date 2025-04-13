// // app/[lang]/layout.tsx
// import { LanguageProvider } from "@/contexts/LanguageContext";
// import { Inter } from "next/font/google"
// import { Providers } from "../providers"
// import { i18nConfig } from '@/i18n-config'
// import { use } from "react";
// import "../globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export async function generateStaticParams() {
//   return [
//     { lang: 'en' },
//     { lang: 'nep' },
//   ];
// }

// export default function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ lang: string }> | { lang: string };
// }) {
//   const resolvedParams = ('then' in params) ? use(params) : params;

//   return (
//     <div lang={resolvedParams.lang}>
//       <div className={inter.className}>
//         <Providers>
//           <LanguageProvider>
//             {children}
//           </LanguageProvider>
//         </Providers>
//       </div>
//     </div>
//   );
// }

// app/[lang]/layout.tsx
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import { i18nConfig } from "@/i18n-config";
import { use } from "react";
import "../globals.css";
import Chatbot from "@/components/Chatbot"; // Import the Chatbot component

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "nep" }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = "then" in params ? use(params) : params;

  return (
    <html lang={resolvedParams.lang}>
      <head>
        <title>Agrisupply Chain</title>
      </head>
      <body className={inter.className}>
        <Providers>
          <LanguageProvider>
            {children}
            <Chatbot />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
