import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PROGRAM_OPTIONS, type CheckResult, type Program } from '@/entities/check'
import { Button } from '@/shared/ui/button'
import { useCreateCheck } from '../api/useCreateCheck'
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
  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
  } = useForm<CreateCheckFormValues>({
    defaultValues: {
      program: '',
    },
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDropActive, setIsDropActive] = useState(false)
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)
  const selectedProgram = useWatch({ control, name: 'program' })
  const fileIssues = useMemo(() => validateFiles(selectedFiles), [selectedFiles])

  const createCheckMutation = useCreateCheck({ onSuccess })
  const requestProgress = useRequestProgress(createCheckMutation.isPending)

  const onSubmit = handleSubmit(({ program }) => {
    setIsSubmitAttempted(true)

    if (fileIssues.length > 0 || selectedFiles.length === 0) {
      return
    }

    createCheckMutation.mutate({
      files: selectedFiles,
      program: program as Program,
    })
  }, () => {
    setIsSubmitAttempted(true)
  })

  const isSubmitDisabled = createCheckMutation.isPending
  const shouldShowProgramError = isSubmitAttempted && !selectedProgram
  const shouldShowFilesError = isSubmitAttempted && selectedFiles.length === 0

  const addFiles = (files: FileList | File[]) => {
    const filesToAdd = Array.from(files)

    setSelectedFiles((currentFiles) => [...currentFiles, ...filesToAdd])
  }

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((file) => file !== fileToRemove))
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={shouldShowProgramError ? `${styles.field} ${styles.fieldInvalid}` : styles.field}>
        <span>Льготная программа</span>
        <select
          aria-invalid={shouldShowProgramError}
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
          addFiles(event.dataTransfer.files)
        }}
      >
        <span>Перетащите файлы сюда или выберите на компьютере</span>
        <input
          multiple
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files)
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
        onClear={() => setSelectedFiles([])}
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
