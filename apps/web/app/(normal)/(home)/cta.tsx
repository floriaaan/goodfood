"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const headlines = [
  ["Tu veux déguster les", "burgers les plus hot autour de toi ?", "Envoie GOODFOOD au 3615"],
  ["Healthy ou guilty pleasure ?", "On a tout ce qu'il te faut !", "Envoie PLEASURE au 3615"],
  ["Dévores le délicieux", "fais toi plaisir avec le divin !", "Envoie CRAVING au 3615"],
];

export const CTA = () => {
  const [headlineIndex, setHeadlineIndex] = useState<number | null>(null);

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * headlines.length));
  }, []);

  return (
    <section className="font-ultrabold relative flex h-64 w-full select-none items-center justify-center overflow-hidden text-white">
      <Image
        src={
          "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
        }
        alt="food image"
        className="overflow-hidden object-cover"
        width={1920}
        height={256}
      />
      {headlineIndex !== null && (
        <div className="absolute flex h-full w-full flex-col items-center justify-center gap-y-1 text-center">
          <div className="w-fit rotate-2 border border-black bg-white px-2 py-1 text-3xl uppercase leading-none text-black">
            {headlines[headlineIndex][0]}
          </div>
          <div className="w-fit -rotate-1 border border-black bg-white px-2 py-1 text-3xl uppercase leading-none text-black">
            {headlines[headlineIndex][1]}
          </div>
          <div className="mt-2 w-fit rotate-[0.75deg] border border-white bg-black px-2 py-1 uppercase leading-none text-white">
            {headlines[headlineIndex][2]}
          </div>
        </div>
      )}
    </section>
  );
};
