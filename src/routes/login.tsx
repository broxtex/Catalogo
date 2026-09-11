import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { identifierToEmail } from "@/lib/catalog/identifier";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [identifier, setIdentifier] = useState("smith");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      let email: string;
      try {
        email = identifierToEmail(identifier);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Usuario no válido.");
        return;
      }
      const { error: err } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (err) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      window.location.href = "/";
    } catch {
      setError("No se pudo entrar. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10">
      <div className="w-full max-w-sm">
        <p className="font-display text-sm italic text-muted">Tienda de Smith</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Entrar a tu tienda</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Solo el equipo administra el catálogo. Los clientes ven las prendas sin iniciar sesión.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="identifier">Usuario o correo</Label>
            <Input
              id="identifier"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="smith"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Un momento…" : "Entrar"}
          </Button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Dueño: usuario <span className="font-semibold text-ink">smith</span>. La contraseña inicial
          está en el README del repositorio.
        </p>

        {authEnabled && GROK_PROVIDERS.length > 0 ? (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-border" />
              o continuar con
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                >
                  Continuar con {p.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-muted">
          ¿No eres Smith? El dueño puede crearte una cuenta de equipo desde{" "}
          <strong>Cuentas</strong> en la tienda.
        </p>

        <p className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Volver al catálogo
          </Link>
        </p>
      </div>
    </main>
  );
}
