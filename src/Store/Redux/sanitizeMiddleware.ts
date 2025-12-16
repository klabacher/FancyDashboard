import type { Middleware } from "@reduxjs/toolkit";
import { registerFunction } from "./functionRegistry";

// Non-enumerable symbol attached to sanitized actions for dev/debug use
export const FN_REF_SYMBOL = Symbol("@@fancydashboard/functionRefs");

// Recursive sanitizer: replaces functions with a serializable object { __fnRef: id }
function sanitizeObject(
  obj: unknown,
  path = ""
): { value: unknown; refs: Record<string, string> } {
  const refs: Record<string, string> = {};

  function walker(value: unknown, curPath: string): unknown {
    if (typeof value === "function") {
      const id = registerFunction(value as (...args: unknown[]) => unknown);
      refs[curPath] = id;
      return { __fnRef: id };
    }

    if (Array.isArray(value)) {
      return value.map((v, i) => walker(v, `${curPath}[${i}]`));
    }

    if (value && typeof value === "object") {
      const out: Record<string, unknown> = Array.isArray(value)
        ? ([] as unknown as Record<string, unknown>)
        : {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = walker(v, curPath ? `${curPath}.${k}` : k);
      }
      return out;
    }

    return value;
  }

  const sanitized = walker(obj, path);
  return { value: sanitized, refs };
}

export const sanitizeMiddleware: Middleware = () => (next) => (action) => {
  if (!action || typeof action !== "object") return next(action);

  // Quick check to avoid expensive recursion when no functions exist
  const containsFunction = (function check(o: unknown): boolean {
    if (!o || typeof o !== "object") return false;
    for (const v of Object.values(o as Record<string, unknown>)) {
      if (typeof v === "function") return true;
      if (typeof v === "object") {
        if (check(v)) return true;
      }
    }
    return false;
  })(action);

  if (!containsFunction) return next(action);

  const { value: sanitized, refs } = sanitizeObject(action);

  // Attach original function references non-enumerably so dev middleware can access them if needed
  if (Object.keys(refs).length > 0) {
    try {
      Object.defineProperty(sanitized, FN_REF_SYMBOL, {
        value: refs,
        enumerable: false,
        configurable: true,
      });
    } catch (e) {
      // ignore
    }

    // Optional: log in dev to help debugging
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "sanitizeMiddleware: replaced function values in action with serializable references",
        { action: sanitized, fnRefs: refs }
      );
    }
  }

  return next(sanitized);
};

export default sanitizeMiddleware;
