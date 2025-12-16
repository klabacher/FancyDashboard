/**
 * Plugin Example: Custom Counter Widget
 * 
 * Este arquivo demonstra como criar e registrar um widget customizado
 * que pode ser usado através do pseudo-DOM (lista de WidgetDescriptor)
 */

import { z } from "zod";
import { registerWidget } from "@Components/BentoGrid";
import { registerWidgetSchema } from "@Types/widgetSchemas";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

//helpers
import { cn } from "@Utils/Helpers";

// 1. Define o schema de validação para o widget
export const CounterWidgetSchema = z.object({
  initialValue: z.number().default(0),
  title: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().default(1),
  color: z.enum(["blue", "green", "red", "purple", "orange"]).default("blue"),
});

export type CounterWidgetProps = z.infer<typeof CounterWidgetSchema>;

// 2. Crie o componente do widget
export function CounterWidget({
  initialValue = 0,
  title,
  min,
  max,
  step = 1,
  color = "blue",
}: CounterWidgetProps) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    if (max !== undefined && count + step > max) return;
    setCount((prev) => prev + step);
  };

  const decrement = () => {
    if (min !== undefined && count - step < min) return;
    setCount((prev) => prev - step);
  };

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", hover: "hover:bg-blue-600" },
    green: { bg: "bg-green-500", text: "text-green-600", hover: "hover:bg-green-600" },
    red: { bg: "bg-red-500", text: "text-red-600", hover: "hover:bg-red-600" },
    purple: { bg: "bg-purple-500", text: "text-purple-600", hover: "hover:bg-purple-600" },
    orange: { bg: "bg-orange-500", text: "text-orange-600", hover: "hover:bg-orange-600" },
  };

  const colors = colorClasses[color];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 items-center justify-center">
      {title && (
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {title}
        </h3>
      )}
      
      <div className="flex flex-col items-center gap-4">
        {/* Display */}
        <div className={cn(
          "text-6xl font-bold transition-colors",
          colors.text,
          "dark:text-white"
        )}>
          {count}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            disabled={min !== undefined && count <= min}
            className={cn(
              "p-3 rounded-full text-white transition-all",
              colors.bg,
              colors.hover,
              "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg hover:shadow-xl"
            )}
          >
            <FiMinus size={20} />
          </button>

          <button
            onClick={increment}
            disabled={max !== undefined && count >= max}
            className={cn(
              "p-3 rounded-full text-white transition-all",
              colors.bg,
              colors.hover,
              "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg hover:shadow-xl"
            )}
          >
            <FiPlus size={20} />
          </button>
        </div>

        {/* Min/Max indicators */}
        {(min !== undefined || max !== undefined) && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {min !== undefined && `Min: ${min}`}
            {min !== undefined && max !== undefined && " | "}
            {max !== undefined && `Max: ${max}`}
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Registre o widget e seu schema
export function initCounterPlugin() {
  registerWidget("counter", CounterWidget);
  registerWidgetSchema("counter", CounterWidgetSchema);
  console.log("✅ Counter Widget Plugin registrado com sucesso!");
}

// Exemplo de uso no pseudo-DOM:
/*
const widgets: WidgetDescriptor[] = [
  {
    id: "counter-1",
    type: "counter",
    colSpan: 1,
    rowSpan: 2,
    props: {
      title: "Contador Simples",
      initialValue: 0,
      min: 0,
      max: 100,
      step: 5,
      color: "blue",
    },
  },
];
*/
