import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ringvirkningsregnskap | NSF Dashboard",
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
        {children}
      </body>
    </html>
  );
}
