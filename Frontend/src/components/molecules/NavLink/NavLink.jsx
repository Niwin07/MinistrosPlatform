import { NavLink as RouterNavLink } from 'react-router-dom'
import Typography from '../../atoms/Typography'

export default function NavLink({ to, label }) {
  return (
    <RouterNavLink to={to}>
      <Typography>{label}</Typography>
    </RouterNavLink>
  )
}
