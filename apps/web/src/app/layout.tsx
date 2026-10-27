import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebMesh — Enterprise P2P Swarm Engine & Network Diagnostics',
  description: 'Enterprise P2P Swarm Engine, WebCrypto AES-GCM-256 Encryption, and Wireshark SCTP Inspector.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#020617] text-slate-100 antialiased min-h-screen cyber-grid">
        {children}
      </body>
    </html>
  );
}
