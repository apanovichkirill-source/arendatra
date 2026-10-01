"use client";

import Image from "next/image";
import { useState } from "react";
import type { VehiclePhoto } from "@/content/vehicle-photos";

export function VehicleGallery({ photos, title }: { photos: VehiclePhoto[]; title: string }) {
  const [active, setActive] = useState(0);
  const photo = photos[active] ?? photos[0];
  if (!photo) return null;

  return (
    <figure>
      <Image
        key={photo.src}
        src={photo.src}
        alt={`${title}: ${photo.alt}`}
        width={1200}
        height={750}
        priority={active === 0}
        sizes="(max-width: 1024px) 100vw, 620px"
        className="aspect-[16/9] w-full rounded-xl object-cover"
      />
      {photos.length > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Показать фото ${i + 1}: ${p.alt}`}
              aria-pressed={i === active}
              className={`overflow-hidden rounded-lg ring-2 transition focus:outline-none focus-visible:ring-brand-blue ${
                i === active ? "ring-brand-blue" : "ring-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={p.src}
                alt=""
                width={240}
                height={150}
                sizes="(max-width: 1024px) 25vw, 150px"
                className="aspect-[16/10] w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <figcaption className="mt-2 text-xs text-gray-400">
        Иллюстративные фото: так выглядит техника этого типа, это не снимки конкретной машины.
        Фото {active + 1}: {photo.author}, {photo.license}
        {photo.licenseUrl && (
          <>
            {" "}
            (<a href={photo.licenseUrl} rel="noopener noreferrer" target="_blank" className="underline">лицензия</a>)
          </>
        )}
        . Источник:{" "}
        <a href={photo.source} rel="noopener noreferrer" target="_blank" className="underline">
          Wikimedia Commons
        </a>
        .
      </figcaption>
    </figure>
  );
}
