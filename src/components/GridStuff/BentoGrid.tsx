import { useEffect, useMemo, useCallback } from "react";
import RGL from "react-grid-layout";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLayout,
  initializeGrid,
  selectMainGrid,
} from "@store/Redux/MainGridSlice";
import BentoItem from "@components/GridStuff/BentoItem";

// Type Imports
import type { RGLType, BentoGridProps } from "@components/types/BentoGrid";

// CSS Imports
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function BentoGrid({ width, height }: BentoGridProps) {
  const dispatch = useDispatch();
  const { elements, gridConfig, isInitialized, resizeConfig, dragConfig } =
    useSelector(selectMainGrid);

  // 1. Cálculo Matemático para "Travar" a altura da Grid
  // Altura Disponível = Altura Total - (Margem Superior + Inferior + (Espaço entre linhas * (NumLinhas - 1)))
  const calculatedRowHeight = useMemo(() => {
    // Proteção: Se a altura for 0 (inicialização), retorna um valor seguro para evitar NaN
    if (height <= 0) return 30;

    const totalVerticalMargin = gridConfig.margin[1] * (gridConfig.maxRows + 1);
    const availableHeight = height - totalVerticalMargin;

    // Cálculo da altura ideal
    const rawHeight = availableHeight / gridConfig.maxRows;

    // AQUI ESTÁ O SEGREDO:
    // Nunca permita que uma linha seja menor que 30px, senão o texto sobrepõe.
    // Isso pode fazer a grid crescer além da tela (scroll), mas evita o overlap feio.
    return Math.max(rawHeight, 30);
  }, [height, gridConfig.maxRows, gridConfig.margin]);

  // 2. Geração Inicial de Layout (Apenas se não estiver inicializado no Redux)
  useEffect(() => {
    if (!isInitialized && width > 0) {
      const itemsCount = 10;
      const initialLayout: RGLType.LayoutItem[] = Array.from(
        { length: itemsCount },
        (_, i) => ({
          i: i.toString(),
          x: (i * 1) % gridConfig.cols,
          y: Math.floor(i / gridConfig.cols) * 1, // Distribuição inicial simples
          w: 1,
          h: 1,
          // Impede que o usuário redimensione para fora da grid (opcional)
          maxH: gridConfig.maxRows,
        })
      );
      dispatch(initializeGrid(initialLayout));
    }
  }, [isInitialized, width, gridConfig.cols, dispatch, gridConfig.maxRows]);

  // 3. Handler de Mudança (Crucial para persistência)
  const handleLayoutChange = useCallback(
    (newLayout: RGLType.Layout) => {
      console.log("Layout Changed:", newLayout);
      // Aqui você pode adicionar um debounce se sentir lentidão,
      // mas o RGL geralmente lida bem com isso no onLayoutChange (drag stop).
      // IMPORTANTE: Só atualizamos se o layout for diferente para evitar loops,
      // mas o Redux Toolkit já faz shallow equality check no state.
      dispatch(updateLayout(newLayout as RGLType.LayoutItem[]));
    },
    [dispatch]
  );

  // Se não estiver inicializado, mostramos nada ou um esqueleto
  if (!isInitialized) return null;

  console.log("Rendering BentoGrid with elements:", resizeConfig);

  return (
    <RGL
      className="layout w-full h-full overflow-hidden relative"
      // Passamos o layout do Redux (Fonte da Verdade)
      layout={elements}
      // Dimensões vindas do SizeProvider
      width={width}
      // Configurações calculadas
      gridConfig={{
        cols: gridConfig.cols,
        containerPadding: gridConfig.containerPadding,
        margin: gridConfig.margin,
        maxRows: gridConfig.maxRows,
        rowHeight: calculatedRowHeight,
      }}
      // Callbacks
      onLayoutChange={handleLayoutChange}
      // Props de comportamento
      // compactType={"vertical"} // "null" permite espaços vazios (free movement). Use "vertical" para gravidade.
      // droppingItem={} latter use - item that is added when dropped from outside
      // dropConfig={}
      // compactor={ } latter use
      // constraints -> Latter use
      autoSize={false} // Desliga autoSize para termos controle total da altura
      resizeConfig={{
        handles: resizeConfig.handles,
        enabled: resizeConfig.enabled,
        // handleComponent(axis, ref) {} exposed handler for better management -> later use
      }}
      dragConfig={{
        ...dragConfig,
        enabled: dragConfig.enabled, // Sincroniza drag com resize enable/disable
      }}
    >
      {elements.map((item) => (
        <div key={item.i} data-grid={item} className="group">
          <BentoItem
            index={Number(item.i)}
            gridW={item.w}
            gridH={item.h}
            rowHeight={calculatedRowHeight}
          />
        </div>
      ))}
    </RGL>
  );
}
