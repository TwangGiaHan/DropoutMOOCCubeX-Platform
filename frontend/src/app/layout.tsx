import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BI MOOCCubeX - Student Dropout Analytics",
  description: "Advanced analytics dashboard for MOOCCubeX Dropout Predictions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900">
        <main className="animate-in fade-in duration-700">
          {children}
        </main>
      </body>
    </html>
  );
}
