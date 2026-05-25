import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Typography from '../../atoms/Typography'
import styles from './SongSearchForm.module.css'

const CHORD_REGEX = /^[A-G](?:#|b)?(?:m|dim|aug|sus[24]|maj[79]|add[9]|[679]|dim7|m7b5)?$/

const searchSchema = z.object({
  query: z.string().min(1, 'Ingresá al menos 1 carácter'),
  keyNote: z
    .string()
    .optional()
    .refine((val) => !val || CHORD_REGEX.test(val.trim()), {
      message: 'Formato de acorde inválido (ej: G, Am, Bb, F#m)',
    }),
})

export default function SongSearchForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
    defaultValues: { query: '', keyNote: '' },
  })

  function submit(data) {
    onSubmit?.(data)
    reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="search-query">
          <Typography variant="label" color="secondary">Canción o artista</Typography>
        </label>
        <Input
          id="search-query"
          placeholder="Oceans, Hillsong..."
          {...register('query')}
        />
        {errors.query && (
          <Typography variant="caption" color="danger">{errors.query.message}</Typography>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="search-key">
          <Typography variant="label" color="secondary">Tono (opcional)</Typography>
        </label>
        <Input
          id="search-key"
          placeholder="G, Am, Bb..."
          {...register('keyNote')}
        />
        {errors.keyNote && (
          <Typography variant="caption" color="danger">{errors.keyNote.message}</Typography>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid}
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Buscando…' : 'Buscar'}
        </Button>
      </div>
    </form>
  )
}
