# Redux Function Registry & Sanitizer

This small utility prevents non-serializable values (functions) from accidentally being included in Redux actions or state.

What it provides:

- `functionRegistry.ts`
  - `registerFunction(fn, key?) -> id` — stores the function in a module-level map and returns a serializable id.
  - `getRegisteredFunction(id)` — get the function back by id.
  - `unregisterFunction(id)` — remove the function from the registry.

- `sanitizeMiddleware.ts`
  - Middleware that runs before Redux's serializability check and replaces any function values found in actions with `{ __fnRef: id }` objects where `id` is the registry id. The mapping of replaced paths → id is attached non-enumerably on the sanitized action under `FN_REF_SYMBOL` for debugging.

How to use:

- Do not dispatch functions in actions. Instead, if an external integration puts a function into an action, the middleware will automatically:
  1. Register the function in the module-level registry
  2. Replace the function in the action with a serializable `{ __fnRef: id }` object

- If you need to actually invoke the function that was passed, call `getRegisteredFunction(id)` where `id` is the `__fnRef` value.

Notes & caveats:

- Storing functions in the registry keeps them in memory — remember to call `unregisterFunction` if you want to avoid leaks (e.g., when unloading plugins).
- The long-term fix is to refactor code to avoid dispatching functions altogether — dispatch a serializable descriptor (string key, config object) instead and manage functions outside Redux.

This middleware is active by default in development and production builds and is safe to keep.
