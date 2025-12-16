import { TextWidgetProps } from "@/Types/widgetSchemas";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function TextComponent({
  text,
  title,
  variant = "default",
  align = "left",
  color,
}: TextWidgetProps) {
  const variantStyles: Record<string, string> = {
    default: "text-base font-normal text-zinc-700 dark:text-zinc-300",
    heading: "text-2xl font-bold text-zinc-900 dark:text-zinc-100",
    subtitle: "text-lg font-semibold text-zinc-800 dark:text-zinc-200",
    caption: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
  };

  const alignStyles: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4">
      {title && (
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="flex-1 flex items-center">
        <p
          className={cn(
            "transition-colors duration-200",
            variantStyles[variant],
            alignStyles[align]
          )}
          style={{ color: color || undefined }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}