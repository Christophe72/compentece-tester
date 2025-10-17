import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Test de Compétence",
  description: "Évaluer des candidats en électricité et informatique",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto p-6 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
