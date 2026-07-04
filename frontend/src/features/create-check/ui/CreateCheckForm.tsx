import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PROGRAM_OPTIONS, type CheckResult, type Program } from '@/entities/check'
import { Button } from '@/shared/ui/button'
import { useCreateCheck } from '../api/useCreateCheck'
import { useCreateCheckFormStore } from '../model/createCheckFormStore'
import { ACCEPTED_FILE_EXTENSIONS, validateFiles } from '../lib/fileValidation'
import { useRequestProgress } from '../lib/useRequestProgress'

import { CreateCheckProgress } from './CreateCheckProgress'
import { SelectedFilesList } from './SelectedFilesList'
import { DocumentRequirementsList } from './DocumentRequirementsList'

import styles from './CreateCheckForm.module.css'

type CreateCheckFormValues = {
  program: Program | ''
}

type CreateCheckFormProps = {
  onSuccess?: (result: CheckResult) => void
}

export function CreateCheckForm({ onSuccess }: CreateCheckFormProps) {
  const program = useCreateCheckFormStore((state) => state.program)
  const selectedFiles = useCreateCheckFormStore((state) => state.selectedFiles)
  const isSubmitAttempted = useCreateCheckFormStore((state) => state.isSubmitAttempted)
  const setProgram = useCreateCheckFormStore((state) => state.setProgram)
  const addFiles = useCreateCheckFormStore((state) => state.addFiles)
  const removeFile = useCreateCheckFormStore((state) => state.removeFile)
  const clearFiles = useCreateCheckFormStore((state) => state.clearFiles)
  const setSubmitAttempted = useCreateCheckFormStore((state) => state.setSubmitAttempted)

  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
  } = useForm<CreateCheckFormValues>({
    defaultValues: {
      program,
    },
  })

  const [isDropActive, setIsDropActive] = useState(false)
  const selectedProgram = useWatch({ control, name: 'program' })
  const fileIssues = useMemo(() => validateFiles(selectedFiles), [selectedFiles])

  const createCheckMutation = useCreateCheck({ onSuccess })
  const requestProgress = useRequestProgress(createCheckMutation.isPending)

  const onSubmit = handleSubmit(({ program }) => {
    setSubmitAttempted(true)

    if (fileIssues.length > 0 || selectedFiles.length === 0) {
      return
    }

    createCheckMutation.mutate({
      files: selectedFiles,
      program: program as Program,
    })
  }, () => {
    setSubmitAttempted(true)
  })

  const isSubmitDisabled = createCheckMutation.isPending
  const shouldShowProgramError = isSubmitAttempted && !selectedProgram
  const shouldShowFilesError = isSubmitAttempted && selectedFiles.length === 0

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={shouldShowProgramError ? `${styles.field} ${styles.fieldInvalid}` : styles.field}>
        <span>Льготная программа</span>
        <select
          aria-invalid={shouldShowProgramError}
          {...register('program', {
            validate: (value) => Boolean(value) || 'Выберите льготную программу',
            onChange: (event) => {
              setProgram(event.target.value as Program | '')
            },
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
      {errors.program || shouldShowProgramError ? (
        <p className={styles.error}>{errors.program?.message ?? 'Выберите льготную программу'}</p>
      ) : null}

      <DocumentRequirementsList program={selectedProgram ?? ''} />

      <label
        className={[
          styles.dropzone,
          isDropActive ? styles.dropzoneActive : '',
          shouldShowFilesError ? styles.dropzoneInvalid : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDropActive(true)
        }}
          onDragLeave={() => setIsDropActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDropActive(false)
            const filesToAdd = Array.from(event.dataTransfer.files)
            addFiles(filesToAdd)
          }}
        >
        <span>Перетащите файлы сюда или выберите на компьютере</span>
        <input
          multiple
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(Array.from(event.target.files))
              event.target.value = ''
            }
          }}
        />
      </label>
      {shouldShowFilesError ? (
        <p className={styles.error}>Добавьте хотя бы один документ для проверки.</p>
      ) : selectedFiles.length === 0 ? (
        <p className={styles.hint}>Добавьте хотя бы один документ.</p>
      ) : null}

      {fileIssues.length > 0 ? (
        <div className={styles.errorList} role="alert">
          <p>Исправьте ошибки в выбранных файлах:</p>
          <ul>
            {fileIssues.map((issue) => (
              <li key={`${issue.fileName}-${issue.message}`}>
                <strong>{issue.fileName}:</strong> {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SelectedFilesList
        files={selectedFiles}
        onClear={clearFiles}
        onRemove={removeFile}
      />

      <CreateCheckProgress
        hasFiles={selectedFiles.length > 0}
        isPending={createCheckMutation.isPending}
        requestProgress={requestProgress}
      />

      {createCheckMutation.isError ? (
        <p className={styles.error}>{createCheckMutation.error.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitDisabled}>
        {createCheckMutation.isPending ? 'Проверяем...' : 'Запустить проверку'}
      </Button>
    </form>
  )
}
