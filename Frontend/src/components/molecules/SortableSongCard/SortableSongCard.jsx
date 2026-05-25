import { useSortable } from '@dnd-kit/sortable'
import SongCard from '../SongCard'

export default function SortableSongCard(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style}>
      <SongCard
        {...props}
        isDragging={isDragging}
        setNodeRef={undefined}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
