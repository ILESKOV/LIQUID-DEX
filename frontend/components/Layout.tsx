import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col min-h-screen gap-16">
      <Navbar />
      <main className="mb-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}
