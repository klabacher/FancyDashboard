import { useState } from "react";
import { TextAreaWidgetProps } from "@/Types/widgetSchemas";

//helpers
import { cn } from "@Utils/Helpers";

export default function TextAreaComponent({
  content,
  title,
  maxLines,
  editable = false,
  placeholder = "Digite algo...",
}: TextAreaWidgetProps) {
  const [text, setText] = useState(content);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4">
      {title && (
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="flex-1 overflow-hidden">
        {editable ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full h-full resize-none bg-transparent",
              "text-sm text-zinc-700 dark:text-zinc-300",
              "border border-zinc-200 dark:border-zinc-700 rounded-lg p-3",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              "transition-all duration-200",
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            )}
            style={{
              maxHeight: maxLines ? `${maxLines * 1.5}em` : undefined,
            }}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full overflow-y-auto text-sm text-zinc-700 dark:text-zinc-300",
              "p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50",
              "scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
            )}
            style={{
              maxHeight: maxLines ? `${maxLines * 1.5}em` : undefined,
            }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
}