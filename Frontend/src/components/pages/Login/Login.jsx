import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import Typography from "../../atoms/Typography";
import styles from "./Login.module.css";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoggingIn = useAuthStore((s) => s.isLoggingIn);
  const loginError = useAuthStore((s) => s.loginError);
  const login = useAuthStore((s) => s.login);

  const emailRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  async function submit(data) {
    try {
      await login(data);
    } catch {
      // error ya está en loginError
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orbPurple}`} />
        <div className={`${styles.orb} ${styles.orbPink}`} />
        <div className={`${styles.orb} ${styles.orbTeal}`} />
      </div>

      <div className={`glass-3 ${styles.card}`}>
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">🎵</span>
          <Typography variant="title" as="span" className={styles.brandTitle}>
            Set<em>list</em>
          </Typography>
          <Typography variant="meta" color="tertiary" className={styles.brandSub}>
            Plataforma de repertorios
          </Typography>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              <Typography variant="label" color="secondary">Email</Typography>
            </label>
            <input
              id="login-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="tucorreo@iglesia.com"
              autoComplete="email"
              ref={(e) => { register("email").ref(e); emailRef.current = e }}
              name="email"
              onChange={register("email").onChange}
              onBlur={register("email").onBlur}
            />
            {errors.email && (
              <Typography variant="caption" color="danger">{errors.email.message}</Typography>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              <Typography variant="label" color="secondary">Contraseña</Typography>
            </label>
            <input
              id="login-password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <Typography variant="caption" color="danger">{errors.password.message}</Typography>
            )}
          </div>

          {loginError && (
            <div className={styles.errorBanner}>
              <Typography variant="caption" color="danger">{loginError}</Typography>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoggingIn || !isValid}
          >
            {isLoggingIn ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <div className={styles.footer}>
          <Typography variant="meta" color="tertiary">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className={styles.link}>Crear cuenta</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
