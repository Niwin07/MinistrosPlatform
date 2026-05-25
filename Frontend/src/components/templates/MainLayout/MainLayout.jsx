import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "../../organisms/Navbar";
import Typography from "../../atoms/Typography";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-6)",
      padding: "var(--space-10)",
      minHeight: "60dvh",
      textAlign: "center",
    }}>
      <div className="glass-4" style={{
        padding: "var(--space-8)",
        maxWidth: 420,
        width: "100%",
      }}>
        <Typography variant="title" as="h1">Error de conexión</Typography>
        <Typography variant="body" color="secondary" style={{ marginTop: "var(--space-3)" }}>
          Algo salió mal. Intentá de nuevo o volvé más tarde.
        </Typography>
        {error && (
          <Typography variant="caption" color="tertiary" style={{ marginTop: "var(--space-2)", fontFamily: "monospace", wordBreak: "break-word" }}>
            {error.message}
          </Typography>
        )}
        <button
          onClick={resetErrorBoundary}
          style={{
            marginTop: "var(--space-6)",
            padding: "var(--space-3) var(--space-6)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border-accent)",
            background: "rgba(108, 99, 255, 0.15)",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            fontWeight: 600,
          }}
          type="button"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
}
