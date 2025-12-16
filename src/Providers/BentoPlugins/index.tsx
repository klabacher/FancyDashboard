/**
 * Plugin Initializer
 * 
 * Importa e inicializa todos os plugins customizados do sistema.
 * Adicione novos plugins aqui para que sejam carregados automaticamente.
 */

import { initCounterPlugin } from "./CounterPlugin";

export function initializeBentoPlugins() {
  // Registra todos os plugins customizados
  initCounterPlugin();
  
  // Adicione mais plugins aqui:
  // initChartPlugin();
  // initCalendarPlugin();
  // etc...
  
  console.log("🎨 Todos os plugins Bento foram inicializados");
}
