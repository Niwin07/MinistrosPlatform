import Input from '../../atoms/Input'
import Button from '../../atoms/Button'

export default function SetlistEditor({ setlist, onSave }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave?.(setlist) }}>
      <Input name="title" defaultValue={setlist?.title} placeholder="Setlist title" />
      <Button type="submit">Save</Button>
    </form>
  )
}
