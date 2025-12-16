import { z } from "zod";

// -------------------- Text Widget Schema --------------------
export const TextWidgetSchema = z.object({
  text: z.string().min(1, "Texto não pode estar vazio"),
  title: z.string().optional(),
  variant: z
    .enum(["default", "heading", "subtitle", "caption"])
    .default("default"),
  align: z.enum(["left", "center", "right"]).default("left"),
  color: z.string().optional(),
});

export type TextWidgetProps = z.infer<typeof TextWidgetSchema>;

// -------------------- TextArea Widget Schema --------------------
export const TextAreaWidgetSchema = z.object({
  content: z.string().min(1, "Conteúdo não pode estar vazio"),
  title: z.string().optional(),
  maxLines: z.number().int().positive().optional(),
  editable: z.boolean().default(false),
  placeholder: z.string().optional(),
});

export type TextAreaWidgetProps = z.infer<typeof TextAreaWidgetSchema>;

// -------------------- Image Widget Schema --------------------
export const ImageWidgetSchema = z.object({
  src: z.string().url("URL da imagem inválida"),
  alt: z.string().default("Imagem"),
  title: z.string().optional(),
  objectFit: z.enum(["cover", "contain", "fill", "none"]).default("cover"),
  overlay: z.boolean().default(false),
  caption: z.string().optional(),
});

export type ImageWidgetProps = z.infer<typeof ImageWidgetSchema>;

// -------------------- Graph Widget Schema --------------------
export const GraphWidgetSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["line", "bar", "area", "pie"]).default("line"),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .min(1, "Dados não podem estar vazios"),
  showGrid: z.boolean().default(true),
  showLegend: z.boolean().default(true),
  animate: z.boolean().default(true),
});

export type GraphWidgetProps = z.infer<typeof GraphWidgetSchema>;

// -------------------- Widget Descriptor com tipo genérico --------------------
export type WidgetType = "text" | "textarea" | "image" | "graph" | string;

export type WidgetDescriptor<T = any> = {
  id: string | number;
  type: WidgetType;
  props: T;
  // Page index (0-based) for pagination
  page?: number;
  colSpan?: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number };
  rowSpan?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  className?: string;
};

// -------------------- Schema Registry --------------------
export const widgetSchemaRegistry = new Map<string, z.ZodSchema>([
  ["text", TextWidgetSchema],
  ["textarea", TextAreaWidgetSchema],
  ["image", ImageWidgetSchema],
  ["graph", GraphWidgetSchema],
]);

export function registerWidgetSchema(type: string, schema: z.ZodSchema) {
  widgetSchemaRegistry.set(type, schema);
}

export function validateWidgetProps(type: string, props: any) {
  const schema = widgetSchemaRegistry.get(type);
  if (!schema) {
    console.warn(`Schema não encontrado para widget tipo: ${type}`);
    return { success: true, data: props };
  }

  const result = schema.safeParse(props);
  if (!result.success) {
    console.error(
      `Validação falhou para widget tipo ${type}:`,
      result.error.flatten()
    );
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
