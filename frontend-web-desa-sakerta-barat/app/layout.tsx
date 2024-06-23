import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Poppins, Glory } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const glory = Glory({
  subsets: ['latin'], 
  variable: '--font-glory',
});

export const metadata: Metadata = {
  title: "Desa Sakerta Barat",
  description: "Website Pelayanan Desa Sakerta Barat",
  icons: {
    icon: '/next.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${glory.variable} ${poppins.variable} ${ibmPlexSerif.variable}`}>{children}</body>
    </html>
  );
}
