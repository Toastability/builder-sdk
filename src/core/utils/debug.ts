type GlobalDebugState = {
  __DT_BUILDER_DEBUG__?: unknown;
  __DT_BUILDER_DEBUG_EVENTS__?: DebugPayload[];
};

const DEBUG_EVENT = "__dt_builder_debug__";
const DEBUG_STORAGE_KEY = "dtBuilderDebug";

const isDebugFlagEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  const global = window as unknown as GlobalDebugState;
  if (typeof global.__DT_BUILDER_DEBUG__ !== "undefined") {
    return Boolean(global.__DT_BUILDER_DEBUG__);
  }
  try {
    const stored = window.localStorage.getItem(DEBUG_STORAGE_KEY);
    if (stored === "1" || stored === "true") return true;
    if (stored === "0" || stored === "false") return false;
  } catch (error) {
    // Access to localStorage may fail (privacy mode, sandbox, etc.)
  }
  return typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BUILDER_DEBUG === "true";
};

type DebugPayload = {
  source: "sdk";
  step: string;
  detail?: Record<string, unknown>;
  timestamp: number;
};

const persistPayload = (payload: DebugPayload) => {
  if (typeof window === "undefined") return;
  const global = window as unknown as GlobalDebugState;
  try {
    if (!Array.isArray(global.__DT_BUILDER_DEBUG_EVENTS__)) {
      global.__DT_BUILDER_DEBUG_EVENTS__ = [];
    }
    global.__DT_BUILDER_DEBUG_EVENTS__!.push(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[BuilderSDK][debug] Failed to persist debug payload", error);
  }
};

export const emitBuilderDebug = (step: string, detail?: Record<string, unknown>) => {
  if (!isDebugFlagEnabled()) return;
  const payload: DebugPayload = {
    source: "sdk",
    step,
    detail,
    timestamp: Date.now(),
  };
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(DEBUG_EVENT, { detail: payload }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[BuilderSDK][debug] Failed to dispatch debug event", error);
    }
    persistPayload(payload);
  }
  try {
    // eslint-disable-next-line no-console
    console.log(`[BuilderSDK][${step}]`, detail ?? {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[BuilderSDK][debug] Failed to log debug event", error);
  }
};

export const DEBUG_EVENT_NAME = DEBUG_EVENT;
