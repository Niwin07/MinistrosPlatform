import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import Typography from "../../atoms/Typography";
import styles from "./Navbar.module.css";

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const SongsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const MinistersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/songs", label: "Canciones", icon: <SongsIcon /> },
  { to: "/ministers", label: "Ministros", icon: <MinistersIcon /> },
  { to: "/profile", label: "Perfil", icon: <ProfileIcon /> },
];

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span aria-hidden="true">🎵</span>
          <Typography variant="subtitle" as="span" className={styles.brandText}>
            Set<em>list</em>
          </Typography>
        </div>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </div>

        <div className={styles.userArea}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user.name[0]}
              </div>
              <div className={styles.userMeta}>
                <Typography variant="meta" className={styles.userName}>{user.name}</Typography>
                <Typography variant="caption" color="tertiary">{user.role}</Typography>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout} type="button" aria-label="Cerrar sesión">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, icon }) {
  const navigate = useNavigate();
  return (
    <button
      className={styles.navItem}
      onClick={() => navigate(to)}
      type="button"
    >
      <span className={styles.navIcon}>{icon}</span>
      <Typography variant="meta">{label}</Typography>
    </button>
  );
}
