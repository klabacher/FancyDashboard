# 🎨 FancyDashboard - Widget Factory System

## 📋 Visão Geral

Sistema moderno de widgets baseado em **pseudo-DOM** (lista de descritores) com validação runtime, animações suaves e arquitetura extensível por plugins.

## 🏗️ Arquitetura

### ComponentFactory (BentoGrid.tsx)

O núcleo do sistema é o `ComponentFactory` que:

- **Recebe uma lista** de `WidgetDescriptor` (pseudo-DOM)
- **Valida props** automaticamente usando schemas Zod
- **Renderiza widgets** dinamicamente usando um registry
- **Anima transições** com Framer Motion

```tsx
const widgets: WidgetDescriptor[] = [
  {
    id: "widget-1",
    type: "text",
    colSpan: 2,
    rowSpan: 1,
    props: {
      text: "Hello World",
      variant: "heading",
    },
  },
];

<ComponentFactory items={widgets} validateProps={true} />;
```

## 📦 Widgets Integrados

### 1. **TextComponent**

Exibe texto com múltiplas variantes e alinhamentos.

**Props:**

- `text` (string, obrigatório): Texto a exibir
- `title` (string, opcional): Título do widget
- `variant` ("default" | "heading" | "subtitle" | "caption"): Estilo do texto
- `align` ("left" | "center" | "right"): Alinhamento
- `color` (string, opcional): Cor customizada

**Exemplo:**

```tsx
{
  id: "text-1",
  type: "text",
  colSpan: 2,
  rowSpan: 1,
  props: {
    text: "Dashboard Principal",
    title: "Boas-vindas",
    variant: "heading",
    align: "center",
    color: "#3b82f6",
  },
}
```

### 2. **TextAreaComponent**

Área de texto com suporte a edição e scroll.

**Props:**

- `content` (string, obrigatório): Conteúdo do texto
- `title` (string, opcional): Título
- `maxLines` (number, opcional): Número máximo de linhas
- `editable` (boolean, default: false): Permite edição
- `placeholder` (string, opcional): Placeholder quando editável

**Exemplo:**

```tsx
{
  id: "textarea-1",
  type: "textarea",
  colSpan: 2,
  rowSpan: 2,
  props: {
    content: "Digite suas notas aqui...",
    title: "Editor",
    editable: true,
    maxLines: 10,
  },
}
```

### 3. **ImageComponent**

Imagem com loading state, error handling e overlay.

**Props:**

- `src` (URL, obrigatório): URL da imagem
- `alt` (string, default: "Imagem"): Texto alternativo
- `title` (string, opcional): Título
- `objectFit` ("cover" | "contain" | "fill" | "none", default: "cover"): Modo de ajuste
- `overlay` (boolean, default: false): Ativa overlay no hover
- `caption` (string, opcional): Legenda exibida no hover

**Exemplo:**

```tsx
{
  id: "image-1",
  type: "image",
  colSpan: 2,
  rowSpan: 2,
  props: {
    src: "https://example.com/image.jpg",
    alt: "Dashboard Analytics",
    title: "Visualização",
    objectFit: "cover",
    overlay: true,
    caption: "Dados em tempo real",
  },
}
```

### 4. **GraphComponent**

Gráficos animados com múltiplos tipos (line, bar, area, pie).

**Props:**

- `title` (string, opcional): Título do gráfico
- `type` ("line" | "bar" | "area" | "pie", default: "line"): Tipo do gráfico
- `data` (array, obrigatório): Array de dados com `{ label, value, color? }`
- `showGrid` (boolean, default: true): Exibe grade
- `showLegend` (boolean, default: true): Exibe legenda
- `animate` (boolean, default: true): Ativa animações

**Exemplo:**

```tsx
{
  id: "graph-1",
  type: "graph",
  colSpan: 2,
  rowSpan: 2,
  props: {
    title: "Vendas Mensais",
    type: "bar",
    data: [
      { label: "Jan", value: 4500, color: "#3b82f6" },
      { label: "Fev", value: 5200, color: "#3b82f6" },
      { label: "Mar", value: 4800, color: "#3b82f6" },
    ],
    showGrid: true,
    showLegend: true,
  },
}
```

## 🔌 Sistema de Plugins

### Criando um Plugin Customizado

**1. Crie o componente e schema:**

```tsx
// src/Providers/BentoPlugins/MyPlugin.tsx
import { z } from "zod";
import { registerWidget } from "@Components/BentoGrid";
import { registerWidgetSchema } from "@Types/widgetSchemas";

// Schema de validação
export const MyWidgetSchema = z.object({
  title: z.string().optional(),
  value: z.number().default(0),
});

export type MyWidgetProps = z.infer<typeof MyWidgetSchema>;

// Componente
export function MyWidget({ title, value }: MyWidgetProps) {
  return (
    <div className="w-full h-full p-4">
      {title && <h3>{title}</h3>}
      <p>Value: {value}</p>
    </div>
  );
}

// Função de registro
export function initMyPlugin() {
  registerWidget("my-widget", MyWidget);
  registerWidgetSchema("my-widget", MyWidgetSchema);
  console.log("✅ My Widget Plugin registrado!");
}
```

**2. Registre no initializer:**

```tsx
// src/Providers/BentoPlugins/index.tsx
import { initMyPlugin } from "./MyPlugin";

export function initializeBentoPlugins() {
  initMyPlugin();
  // ... outros plugins
}
```

**3. Use no pseudo-DOM:**

```tsx
const widgets: WidgetDescriptor[] = [
  {
    id: "custom-1",
    type: "my-widget",
    colSpan: 1,
    rowSpan: 1,
    props: {
      title: "Meu Widget",
      value: 42,
    },
  },
];
```

## 🎯 Exemplo: Plugin Counter

O projeto inclui um plugin de exemplo (`CounterPlugin.tsx`) que demonstra:

- ✅ Validação de props com Zod
- ✅ Estado interno com useState
- ✅ Estilos customizados e variantes de cor
- ✅ Interatividade (botões +/-)
- ✅ Limites (min/max)

```tsx
{
  id: "counter-1",
  type: "counter",
  colSpan: 1,
  rowSpan: 2,
  props: {
    title: "Contador",
    initialValue: 0,
    min: 0,
    max: 100,
    step: 5,
    color: "blue",
  },
}
```

## 🎨 Layout e Grid

### Configuração de Span

```tsx
colSpan: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number }
rowSpan: 1 | 2 | 3 | 4
```

### Grid System

- **Mobile:** 1 coluna
- **Tablet (sm):** 2 colunas
- **Desktop (lg):** 4 colunas
- **Altura base:** 160px por row
- **Grid dense:** Otimiza espaços vazios automaticamente

## ✨ Animações

Todas as animações são gerenciadas pelo Framer Motion:

- **Layout animations:** Reorganização automática
- **Enter/Exit:** Fade + scale
- **Hover states:** Sombras e overlays
- **Smooth transitions:** Spring physics

## 🛡️ Validação

Sistema de validação em 3 camadas:

1. **Schema Zod:** Define tipos e constraints
2. **Runtime validation:** Valida props no ComponentFactory
3. **Error Widget:** Exibe erros de validação em desenvolvimento

## 📱 Responsividade

- Layout totalmente responsivo
- Suporte a dark mode nativo
- Altura controlada respeitando taskbar (100vh)
- Scroll suave no container principal
- Viewport otimizado para Tauri/Electron

## 🚀 Uso

### Modo Simples

```tsx
import ComponentFactory, { WidgetDescriptor } from "@Components/BentoGrid";

const widgets: WidgetDescriptor[] = [
  { id: 1, type: "text", props: { text: "Hello" } },
];

<ComponentFactory items={widgets} />;
```

### Modo Avançado com Estado

```tsx
const [widgets, setWidgets] = useState<WidgetDescriptor[]>(INITIAL_WIDGETS);

const addWidget = () => {
  setWidgets((prev) => [...prev, newWidget]);
};

const shuffleWidgets = () => {
  setWidgets((prev) => [...prev].sort(() => Math.random() - 0.5));
};
```

## 🔧 Configuração

### Path Aliases (tsconfig.json / vite.config.ts)

```json
{
  "@/": ["./src"],
  "@Components/*": ["Components/*"],
  "@Types/*": ["Types/*"],
  "@Pages/*": ["Pages/*"]
}
```

## 📂 Estrutura de Arquivos

```
src/
├── Components/
│   ├── BentoGrid.tsx          # Factory + Registry
│   └── BentoComponents/        # Widgets built-in
│       ├── TextComponent.tsx
│       ├── TextAreaComponent.tsx
│       ├── ImageComponent.tsx
│       └── GraphComponent.tsx
├── Types/
│   └── widgetSchemas.ts       # Schemas Zod + Types
├── Providers/
│   └── BentoPlugins/          # Custom plugins
│       ├── index.tsx          # Plugin initializer
│       └── CounterPlugin.tsx  # Exemplo de plugin
└── Pages/
    └── Dashboard.tsx          # Demo completa
```

## 🎓 Recursos Avançados

### Widgets Clicáveis

```tsx
{
  id: "clickable",
  type: "text",
  props: { text: "Clique aqui" },
  onClick: () => alert("Clicado!"),
}
```

### Classes CSS Customizadas

```tsx
{
  id: "styled",
  type: "text",
  props: { text: "Custom" },
  className: "bg-blue-100 dark:bg-blue-900",
}
```

### Validação Condicional

```tsx
<ComponentFactory
  items={widgets}
  validateProps={process.env.NODE_ENV === "development"}
/>
```

## 🐛 Debug

Erros de validação aparecem como `ErrorWidget` em desenvolvimento:

- Mostra o tipo do widget
- Exibe mensagens de erro do Zod
- Styling vermelho para fácil identificação

## 🌟 Benefícios

✅ **Type-safe:** TypeScript + Zod  
✅ **Extensível:** Sistema de plugins robusto  
✅ **Declarativo:** Pseudo-DOM simples e legível  
✅ **Performático:** Animações otimizadas  
✅ **Responsivo:** Mobile-first design  
✅ **Acessível:** Semântica HTML correta  
✅ **Dark Mode:** Suporte nativo  
✅ **DX Superior:** DevTools integradas

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS v4 + Framer Motion + Zod**
