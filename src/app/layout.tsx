import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Ringvirkningsregnskap | Dashboard",
  description: "Interaktivt dashboard for samfunnsøkonomiske ringvirkninger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="min-h-screen bg-slate-50 antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
