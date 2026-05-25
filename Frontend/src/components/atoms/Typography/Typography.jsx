import styles from "./Typography.module.css";

/**
 * Typography — Átomo
 *
 * @param {'title'|'subtitle'|'body'|'meta'|'label'|'caption'} variant
 * @param {'h1'|'h2'|'h3'|'h4'|'p'|'span'|'small'}           as       - Tag HTML a renderizar
 * @param {'primary'|'secondary'|'tertiary'|'accent'|'danger'|'success'} color
 * @param {'left'|'center'|'right'}                             align
 * @param {boolean}                                             truncate  - Corta con ellipsis
 * @param {string}                                             className
 * @param {React.ReactNode}                                    children
 */
export default function Typography({
  variant = "body",
  as,
  color = "primary",
  align = "left",
  truncate = false,
  className = "",
  children,
  ...rest
}) {
  // Tag por defecto según variante (semántica HTML correcta)
  const defaultTags = {
    title: "h2",
    subtitle: "h3",
    body: "p",
    meta: "span",
    label: "span",
    caption: "small",
  };

  const Tag = as ?? defaultTags[variant] ?? "p";

  const classes = [
    styles.base,
    styles[variant],
    styles[`color-${color}`],
    styles[`align-${align}`],
    truncate ? styles.truncate : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
