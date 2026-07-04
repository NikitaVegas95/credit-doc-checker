import { useForm, useWatch } from 'react-hook-form'
import { PROGRAM_OPTIONS, type CheckResult, type Program } from '@/entities/check'
import { Button } from '@/shared/ui/button'
import { useCreateCheck } from '../api/useCreateCheck'

import { SelectedFilesList } from './SelectedFilesList'

import styles from './CreateCheckForm.module.css'

type CreateCheckFormValues = {
  program: Program | ''
  files: FileList
}

type CreateCheckFormProps = {
  onSuccess?: (result: CheckResult) => void
}

export function CreateCheckForm({ onSuccess }: CreateCheckFormProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
    resetField,
  } = useForm<CreateCheckFormValues>({
    defaultValues: {
      program: '',
    },
  })

  const selectedFilesValue = useWatch({ control, name: 'files' })
  const selectedProgram = useWatch({ control, name: 'program' })
  const selectedFiles = Array.from(selectedFilesValue ?? [])

  const createCheckMutation = useCreateCheck({ onSuccess })

  const onSubmit = handleSubmit(({ files, program }) => {
    createCheckMutation.mutate({
      files: Array.from(files),
      program: program as Program,
    })
  })

  const isSubmitDisabled =
    createCheckMutation.isPending || !selectedProgram || selectedFiles.length === 0

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>Льготная программа</span>
        <select
          {...register('program', {
            validate: (value) => Boolean(value) || 'Выберите льготную программу',
          })}
        >
          <option value="" disabled>
            Выберите программу
          </option>
          {PROGRAM_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {errors.program ? <p className={styles.error}>{errors.program.message}</p> : null}

      <label className={styles.dropzone}>
        <span>Перетащите файлы сюда или выберите на компьютере</span>
        <input
          multiple
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          {...register('files', {
            validate: (value) => value.length > 0 || 'Добавьте хотя бы один документ',
          })}
        />
      </label>
      {errors.files ? <p className={styles.error}>{errors.files.message}</p> : null}

      <SelectedFilesList files={selectedFiles} onClear={() => resetField('files')} />

      {createCheckMutation.isError ? (
        <p className={styles.error}>{createCheckMutation.error.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitDisabled}>
        {createCheckMutation.isPending ? 'Проверяем...' : 'Запустить проверку'}
      </Button>
    </form>
  )
}
