import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Typography from '../../atoms/Typography'
import styles from './AddSongForm.module.css'

const SECTION_TYPES = [
  { value: 'intro', label: 'Intro' },
  { value: 'verso', label: 'Verso' },
  { value: 'coro', label: 'Coro' },
  { value: 'puente', label: 'Puente' },
  { value: 'outro', label: 'Outro' },
]

const songSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  artist: z.string().min(1, 'El artista es obligatorio'),
  keyNote: z.string().optional(),
  sections: z
    .array(
      z.object({
        type: z.enum(['intro', 'verso', 'coro', 'puente', 'outro']),
        text: z.string().min(1, 'La letra no puede estar vacía'),
      }),
    )
    .min(1, 'Agregá al menos una sección'),
})

export default function AddSongForm({ onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(songSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      artist: '',
      keyNote: '',
      sections: [{ type: 'verso', text: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'sections' })

  function submit(data) {
    onSubmit?.(data)
    reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="song-title">
          <Typography variant="label" color="secondary">Título</Typography>
        </label>
        <Input id="song-title" placeholder="Oceans" {...register('title')} />
        {errors.title && (
          <Typography variant="caption" color="danger">{errors.title.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="song-artist">
          <Typography variant="label" color="secondary">Artista</Typography>
        </label>
        <Input id="song-artist" placeholder="Hillsong United" {...register('artist')} />
        {errors.artist && (
          <Typography variant="caption" color="danger">{errors.artist.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="song-key">
          <Typography variant="label" color="secondary">Tono (opcional)</Typography>
        </label>
        <Input id="song-key" placeholder="G, Am, Bb..." {...register('keyNote')} />
      </div>

      <hr className={styles.divider} />

      <div className={styles.sectionHeader}>
        <Typography variant="label" color="secondary">Letra por secciones</Typography>
        {errors.sections && !Array.isArray(errors.sections) && (
          <Typography variant="caption" color="danger">{errors.sections.message}</Typography>
        )}
      </div>

      <div className={styles.sectionsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={`glass-1 ${styles.sectionCard}`}>
            <div className={styles.sectionRow}>
              <select
                className={styles.select}
                {...register(`sections.${index}.type`)}
              >
                {SECTION_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {fields.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => remove(index)}
                  aria-label="Eliminar sección"
                >
                  <TrashIcon />
                </button>
              )}
            </div>

            <textarea
              className={`${styles.textarea} glass-0`}
              rows={3}
              placeholder="Letra de la sección..."
              {...register(`sections.${index}.text`)}
            />
            {errors.sections?.[index]?.text && (
              <Typography variant="caption" color="danger">
                {errors.sections[index].text.message}
              </Typography>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.addSection}
        onClick={() => append({ type: 'verso', text: '' })}
      >
        + Añadir sección
      </button>

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting || !isValid} className={styles.submitBtn}>
          {isSubmitting ? 'Guardando…' : 'Guardar canción'}
        </Button>
      </div>
    </form>
  )
}

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
