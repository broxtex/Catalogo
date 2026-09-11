import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { getCatalog } from "@/lib/catalog/server";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  pendingComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-paper text-muted">Cargando catálogo…</div>
  ),
  component: Home,
});

function Home() {
  const catalog = Route.useLoaderData();
  return <CatalogPage catalog={catalog} />;
}
