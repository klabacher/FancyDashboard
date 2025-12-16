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

// -------------------- Widget Constraints Schema --------------------
export const WidgetConstraintsSchema = z.object({
  resizable: z.boolean().default(false),
  minW: z.number().int().min(1).max(4).optional(),
  maxW: z.number().int().min(1).max(4).optional(),
  minH: z.number().int().min(1).max(4).optional(),
  maxH: z.number().int().min(1).max(4).optional(),
  lockedAspect: z.boolean().optional(),
});

export type WidgetConstraints = z.infer<typeof WidgetConstraintsSchema>;

// -------------------- Widget Position Schema --------------------
export const WidgetPositionSchema = z.object({
  x: z.number().int().min(0), // Column position (0-based)
  y: z.number().int().min(0), // Row position (0-based)
});

export type WidgetPosition = z.infer<typeof WidgetPositionSchema>;

// -------------------- Widget Size Types --------------------
export type WidgetSize = "1x1" | "1x2" | "2x1" | "2x2" | "2x3" | "3x2" | "4x2";

export const WidgetSizeSchema = z.enum([
  "1x1",
  "1x2",
  "2x1",
  "2x2",
  "2x3",
  "3x2",
  "4x2",
]);

// Helper to parse size string to dimensions
export function parseSizeToDimensions(size: WidgetSize): {
  w: number;
  h: number;
} {
  const [w, h] = size.split("x").map(Number);
  return { w, h };
}

// Helper to create size string from dimensions
export function dimensionsToSize(w: number, h: number): WidgetSize {
  return `${w}x${h}` as WidgetSize;
}

// -------------------- Widget Descriptor com tipo genérico --------------------
export type WidgetType =
  | "text"
  | "textarea"
  | "image"
  | "graph"
  | "icon-app"
  | string;

export type WidgetDescriptor<T = any> = {
  id: string | number;
  type: WidgetType;
  props: T;
  // Page index (0-based) for pagination
  page?: number;
  // Grid positioning (new)
  position?: WidgetPosition;
  size?: WidgetSize;
  // Legacy span support (deprecated, use size instead)
  colSpan?: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number };
  rowSpan?: 1 | 2 | 3 | 4;
  // Constraint system (new)
  constraints?: WidgetConstraints;
  // Interaction
  onClick?: () => void;
  onResize?: (size: WidgetSize) => void;
  className?: string;
  // State flags
  isDragging?: boolean;
  isResizing?: boolean;
};

// -------------------- Default Constraints by Widget Type --------------------
export const defaultConstraintsByType: Record<string, WidgetConstraints> = {
  "icon-app": {
    resizable: false,
    minW: 1,
    maxW: 1,
    minH: 1,
    maxH: 1,
    lockedAspect: true,
  },
  text: {
    resizable: true,
    minW: 1,
    maxW: 4,
    minH: 1,
    maxH: 2,
  },
  textarea: {
    resizable: true,
    minW: 1,
    maxW: 4,
    minH: 1,
    maxH: 4,
  },
  image: {
    resizable: true,
    minW: 1,
    maxW: 4,
    minH: 1,
    maxH: 4,
    lockedAspect: true,
  },
  graph: {
    resizable: true,
    minW: 2,
    maxW: 4,
    minH: 2,
    maxH: 4,
  },
};

// Helper to get constraints for a widget type
export function getDefaultConstraints(type: WidgetType): WidgetConstraints {
  return (
    defaultConstraintsByType[type] || {
      resizable: true,
      minW: 1,
      maxW: 4,
      minH: 1,
      maxH: 4,
    }
  );
}

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
