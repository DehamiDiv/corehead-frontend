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
  const registration = getHomeLayoutRegistration(homeStyle);
  const Renderer = DEDICATED_HOME_RENDERERS[registration.renderer];
  if (!Renderer) return null;
  return function RegisteredHomeRenderer(props: HomeLayoutProps) {
    return createElement(Renderer, normalizeHomeLayoutProps(props));
  };
}

export function hasRegisteredHomeRenderer(homeStyle: unknown): boolean {
  const registration = getHomeLayoutRegistration(homeStyle);
  return (
    registration.renderer === "classic" ||
    registration.renderer === "nature" ||
    Boolean(DEDICATED_HOME_RENDERERS[registration.renderer])
  );
}
