import { useState } from "react";
import { ImageWidgetProps } from "@/Types/widgetSchemas";

//helpers
import { cn } from "@Utils/Helpers";

export default function IconAppComponent({
  src,
  alt,
  title,
  objectFit = "cover",
  overlay = false,
  caption,
}: ImageWidgetProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  const objectFitMap: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 bg-zinc-100 dark:bg-zinc-800">
        <svg
          className="w-12 h-12 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Falha ao carregar imagem</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden group">
      {title && (
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="relative flex-1 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 animate-pulse">
            <div className="w-8 h-8 border-4 border-zinc-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full transition-all duration-300",
            objectFitMap[objectFit],
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        {overlay && (
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm text-white font-medium">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}