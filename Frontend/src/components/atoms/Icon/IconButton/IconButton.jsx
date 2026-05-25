import styles from "./IconButton.module.css";

/**
 * IconButton — Átomo
 *
 * @param {React.ReactNode} icon       - Ícono a renderizar dentro del botón
 * @param {function}        onClick    - Handler del click
 * @param {'sm'|'md'|'lg'}  size       - Tamaño del botón (default: 'md')
 * @param {'default'|'accent'|'danger'} variant - Variante visual
 * @param {string}          label      - Aria-label para accesibilidad (obligatorio)
 * @param {boolean}         disabled   - Estado deshabilitado
 * @param {string}          className  - Clases adicionales
 */
export default function IconButton({
  icon,
  onClick,
  size = "md",
  variant = "default",
  label,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`${styles.iconButton} ${styles[size]} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      type="button"
      {...rest}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.ripple} />
    </button>
  );
}
