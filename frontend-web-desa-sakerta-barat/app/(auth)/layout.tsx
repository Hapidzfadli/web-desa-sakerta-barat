import { Glory } from 'next/font/google';

export const glory = Glory({
  subsets: ['latin'],
  variable: '--font-glory',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="login" className="flex">
      <main className={`w-full `}>{children}</main>
    </div>
  );
}
