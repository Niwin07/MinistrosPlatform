import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import Typography from "../../atoms/Typography";
import styles from "./Register.module.css";

const registerSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Formato de email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function submit(data) {
    await login({ email: data.email, password: data.password });
    navigate("/", { replace: true });
  }

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
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
            Creá tu cuenta
          </Typography>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-name">
              <Typography variant="label" color="secondary">Nombre</Typography>
            </label>
            <input
              id="reg-name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              placeholder="Tu nombre"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <Typography variant="caption" color="danger">{errors.name.message}</Typography>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-email">
              <Typography variant="label" color="secondary">Email</Typography>
            </label>
            <input
              id="reg-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="tucorreo@iglesia.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <Typography variant="caption" color="danger">{errors.email.message}</Typography>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">
              <Typography variant="label" color="secondary">Contraseña</Typography>
            </label>
            <input
              id="reg-password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="Mín. 6 caracteres"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <Typography variant="caption" color="danger">{errors.password.message}</Typography>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-confirm">
              <Typography variant="label" color="secondary">Confirmar contraseña</Typography>
            </label>
            <input
              id="reg-confirm"
              type="password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              placeholder="Repetí la contraseña"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <Typography variant="caption" color="danger">{errors.confirmPassword.message}</Typography>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <div className={styles.footer}>
          <Typography variant="meta" color="tertiary">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className={styles.link}>Iniciar sesión</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
