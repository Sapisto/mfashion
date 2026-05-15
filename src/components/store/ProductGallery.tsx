"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Props {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: Props) {
  const all = images.length > 0 ? images : ["/placeholder-product.svg"];
  const [active, setActive] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [
      Autoplay({
        delay: 1000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActive(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {/* Main carousel */}
      <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-brand-sand group">
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {all.map((img, i) => (
              <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
                <Image
                  src={img}
                  alt={i === 0 ? name : `${name} — ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 50vw"
                  className="object-cover"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 w-full min-w-0">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
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
