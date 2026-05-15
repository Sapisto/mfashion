"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const all = images.length > 0 ? images : ["/placeholder-product.svg"];

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {/* Main image */}
      <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-brand-sand">
        <Image
          src={all[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 w-full min-w-0">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 sm:w-20 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-colors ${
                active === i
                  ? "border-brand-terracotta"
                  : "border-transparent hover:border-brand-border"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
