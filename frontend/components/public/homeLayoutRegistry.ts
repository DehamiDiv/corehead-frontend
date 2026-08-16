import { createElement, type ComponentType } from "react";
import { getHomeLayoutRegistration } from "@/contracts/appearance-registry-v1.js";
import BentoHomeLayout from "@/components/public/BentoHomeLayout";
import BloomHomeLayout from "@/components/public/BloomHomeLayout";
import GlassHomeLayout from "@/components/public/GlassHomeLayout";
import PaperHomeLayout from "@/components/public/PaperHomeLayout";
import PortalsHomeLayout from "@/components/public/PortalsHomeLayout";
import StudioHomeLayout from "@/components/public/StudioHomeLayout";
import {
  normalizeHomeLayoutProps,
  type HomeLayoutProps,
  type NormalizedHomeLayoutProps,
} from "@/components/public/homeLayoutTypes";

const DEDICATED_HOME_RENDERERS: Readonly<
  Record<string, ComponentType<NormalizedHomeLayoutProps>>
> = Object.freeze({
  bento: BentoHomeLayout,
  bloom: BloomHomeLayout,
  glass: GlassHomeLayout,
  paper: PaperHomeLayout,
  portals: PortalsHomeLayout,
  studio: StudioHomeLayout,
});

export function getDedicatedHomeRenderer(homeStyle: unknown) {
  const registration = getHomeLayoutRegistration(String(homeStyle || ""));
  // Older deployed appearance contracts did not expose `renderer`. Layout IDs
  // are canonical and intentionally match the dedicated renderer keys, so use
  // the ID as a compatibility fallback instead of silently rendering Classic.
  const rendererKey = registration.renderer || registration.id;
  const Renderer = DEDICATED_HOME_RENDERERS[rendererKey];
  if (!Renderer) return null;
  return function RegisteredHomeRenderer(props: HomeLayoutProps) {
    return createElement(Renderer, normalizeHomeLayoutProps(props));
  };
}

export function hasRegisteredHomeRenderer(homeStyle: unknown): boolean {
  const registration = getHomeLayoutRegistration(String(homeStyle || ""));
  const rendererKey = registration.renderer || registration.id;
  return (
    rendererKey === "classic" ||
    rendererKey === "nature" ||
    Boolean(DEDICATED_HOME_RENDERERS[rendererKey])
  );
}
