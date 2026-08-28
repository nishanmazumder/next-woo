import type { Metadata } from "next";
import Image from "next/image";

import img1 from "@/public/images/img1.jpg";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-lime-900 p-6 text-white">
      <h1 className="text-3xl font-bold">About</h1>

      <Image
        className="mt-6 h-auto max-w-full rounded"
        src={img1}
        alt="Example landscape"
        placeholder="blur"
        sizes="(max-width: 640px) 100vw, 350px"
      />
    </section>
  );
}
