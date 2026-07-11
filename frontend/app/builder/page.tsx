import { redirect } from "next/navigation";

/**
 * R4-1: Legacy `/builder` is deprecated.
 * Canonical visual builder lives at `/admin/builder`.
 */
export default function LegacyBuilderRedirect() {
  redirect("/admin/builder");
}
