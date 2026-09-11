import { useState } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Tienda de Smith";

const fetchSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const u = await getSessionUser();
  return u ? { id: u.id, email: u.email } : null;
});

function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 20_000, refetchOnWindowFocus: false } },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export const Route = createRootRoute({
  beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#33493C" },
      {
        name: "description",
        content: "Catálogo de streetwear de Tienda de Smith. Mira prendas, arma tu pedido y envíalo por WhatsApp.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Karla:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="es" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Providers>
            <Outlet />
            <Toaster
              position="bottom-center"
              toastOptions={{
                className:
                  "!bg-ink !text-cream !border-0 !rounded-full !px-5 !py-3 !text-sm",
              }}
            />
          </Providers>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
