import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Firstweeks',
  description: 'Personalized postpartum recovery support for first-time mothers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}