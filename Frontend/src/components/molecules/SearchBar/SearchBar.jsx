import Input from '../../atoms/Input'
import Button from '../../atoms/Button'

export default function SearchBar({ onSearch }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch?.(e.target.query.value) }}>
      <Input name="query" placeholder="Search songs..." />
      <Button type="submit">Search</Button>
    </form>
  )
}
