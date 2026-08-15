export const THEME_REGISTRY: Record<string, any>;
export const HOME_LAYOUT_REGISTRY: Record<string, any>;
export const THEME_PREVIEW_ASSETS: Record<string, string>;

export function getHomeLayoutRegistration(id: string): any;
export function getThemeRegistration(id: string): any;
export function getThemePreset(id: string): any;

const _default: {
  THEME_REGISTRY: typeof THEME_REGISTRY;
  HOME_LAYOUT_REGISTRY: typeof HOME_LAYOUT_REGISTRY;
  THEME_PREVIEW_ASSETS: typeof THEME_PREVIEW_ASSETS;
  getHomeLayoutRegistration: typeof getHomeLayoutRegistration;
  getThemeRegistration: typeof getThemeRegistration;
  getThemePreset: typeof getThemePreset;
};
export default _default;
