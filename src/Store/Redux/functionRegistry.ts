// Module-level registry to keep functions out of Redux state/actions
const registry = new Map<string, (...args: unknown[]) => unknown>();

export function registerFunction(
  fn: (...args: unknown[]) => unknown,
  key?: string
) {
  const id =
    key ??
    `fn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  registry.set(id, fn);
  return id;
}

export function getRegisteredFunction<
  T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown,
>(id: string): T | undefined {
  return registry.get(id) as T | undefined;
}

export function unregisterFunction(id: string) {
  registry.delete(id);
}

export function clearFunctionRegistry() {
  registry.clear();
}
