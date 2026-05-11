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
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-brand-sand">
        <Image
          src={all[active]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {all.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-colors ${
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
