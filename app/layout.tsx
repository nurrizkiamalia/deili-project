import type { Metadata } from "next";
import { Montserrat, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400","500","600","700","800","900"]
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["300", "400","500","600","700","800"]
});

export const metadata: Metadata = {
  title: "Deili Project",
  description: "Solution For Financial Incursion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="m-0">
      <body className={`${montserrat.variable} ${bricolage.variable} font-montserrat flex flex-col justify-center items-center !pointer-events-auto`}>
        {children}
      </body>
    </html>
  );
}
