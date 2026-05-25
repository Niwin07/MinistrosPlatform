import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../../atoms/Input'
import Typography from '../../atoms/Typography'
import Button from '../../atoms/Button'
import KeySelector from '../../molecules/KeySelector'
import styles from './SongEditor.module.css'

const songSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  artist: z.string().min(1, 'El artista es obligatorio'),
  bpm: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: 'Solo números' }),
})

export default function SongEditor({ initialData, onSave, onCancel }) {
  const [keyNote, setKeyNote] = useState(initialData?.keyNote || '')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(songSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      artist: initialData?.artist || '',
      bpm: initialData?.bpm?.toString() || '',
    },
  })

  useEffect(() => {
    reset({
      title: initialData?.title || '',
      artist: initialData?.artist || '',
      bpm: initialData?.bpm?.toString() || '',
    })
    setKeyNote(initialData?.keyNote || '')
  }, [initialData, reset])

  const hasChanges = isDirty || keyNote !== (initialData?.keyNote || '')

  function submit(data) {
    onSave?.({ ...data, keyNote })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      {hasChanges && (
        <div className={styles.dirtyBar}>
          <Typography variant="caption" color="accent">• Cambios sin guardar</Typography>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="edit-title">
          <Typography variant="label" color="secondary">Título</Typography>
        </label>
        <Input id="edit-title" {...register('title')} />
        {errors.title && (
          <Typography variant="caption" color="danger">{errors.title.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="edit-artist">
          <Typography variant="label" color="secondary">Artista</Typography>
        </label>
        <Input id="edit-artist" {...register('artist')} />
        {errors.artist && (
          <Typography variant="caption" color="danger">{errors.artist.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="edit-bpm">
          <Typography variant="label" color="secondary">BPM (opcional)</Typography>
        </label>
        <Input id="edit-bpm" type="number" placeholder="72" {...register('bpm')} />
        {errors.bpm && (
          <Typography variant="caption" color="danger">{errors.bpm.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <Typography variant="label" color="secondary">Tono</Typography>
        <KeySelector value={keyNote} onChange={setKeyNote} />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !isValid || !hasChanges}
          className={styles.saveBtn}
        >
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
