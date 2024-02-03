import { isClient } from "./is.js";

export const defaultWindow = /* #__PURE__ */ isClient ? window : undefined;
export const defaultDocument = /* #__PURE__ */ isClient ? window.document : undefined;
export const defaultNavigator = /* #__PURE__ */ isClient ? window.navigator : undefined;
export const defaultLocation = /* #__PURE__ */ isClient ? window.location : undefined;
