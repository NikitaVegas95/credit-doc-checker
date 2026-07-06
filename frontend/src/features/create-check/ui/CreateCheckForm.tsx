import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { PROGRAM_OPTIONS, type CheckResult, type Program } from '@/entities/check'
import { Button } from '@/shared/ui/button'
import { useCreateCheck } from '../api/useCreateCheck'
import { useCreateCheckFormStore } from '../model/createCheckFormStore'
import { ACCEPTED_FILE_EXTENSIONS, validateFiles } from '../lib/fileValidation'

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
  const storedProgram = useCreateCheckFormStore((state) => state.program)
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
    reset,
  } = useForm<CreateCheckFormValues>({
    defaultValues: {
      program: storedProgram,
    },
  })

  const programSelectRef = useRef<HTMLSelectElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const lastFocusedErrorSignature = useRef('')
  const [isDropActive, setIsDropActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const selectedProgram = useWatch({ control, name: 'program' })
  const fileIssues = useMemo(() => validateFiles(selectedFiles), [selectedFiles])

  const createCheckMutation = useCreateCheck({
    onSuccess,
    onUploadProgress: setUploadProgress,
  })

  useEffect(() => {
    if (selectedProgram !== storedProgram) {
      reset({ program: storedProgram })
    }
  }, [reset, selectedProgram, storedProgram])

  useEffect(() => {
    if (!isSubmitAttempted || createCheckMutation.isPending) {
      lastFocusedErrorSignature.current = ''
      return
    }

    const hasProgramError = !selectedProgram
    const hasFilesError = selectedFiles.length === 0 || fileIssues.length > 0

    if (!hasProgramError && !hasFilesError) {
      return
    }

    const nextErrorSignature = [
      hasProgramError ? 'program' : 'files',
      selectedFiles.length,
      fileIssues.map((issue) => `${issue.fileName}:${issue.message}`).join('|'),
    ].join(':')

    if (lastFocusedErrorSignature.current === nextErrorSignature) {
      return
    }

    lastFocusedErrorSignature.current = nextErrorSignature

    const target = hasProgramError ? programSelectRef.current : fileInputRef.current
    target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    target?.focus()
  }, [createCheckMutation.isPending, fileIssues, isSubmitAttempted, selectedFiles.length, selectedProgram])

  const onSubmit = handleSubmit(({ program }) => {
    setSubmitAttempted(true)
    setUploadProgress(0)

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

  const isSubmitDisabled = createCheckMutation.isPending || fileIssues.length > 0
  const shouldShowProgramError = isSubmitAttempted && !selectedProgram
  const shouldShowFilesError = isSubmitAttempted && selectedFiles.length === 0
  const hasDraft = Boolean(storedProgram || selectedFiles.length || isSubmitAttempted || createCheckMutation.isSuccess || createCheckMutation.isError)
  const programErrorId = 'create-check-program-error'
  const filesErrorId = 'create-check-files-error'
  const filesIssuesId = 'create-check-files-issues'
  const programDescribedBy = [
    errors.program || shouldShowProgramError ? programErrorId : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined
  const filesDescribedBy = [
    shouldShowFilesError ? filesErrorId : '',
    fileIssues.length > 0 ? filesIssuesId : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={shouldShowProgramError ? `${styles.field} ${styles.fieldInvalid}` : styles.field}>
        <span>Льготная программа</span>
        <Controller
          control={control}
          name="program"
          rules={{
            validate: (value) => Boolean(value) || 'Выберите льготную программу',
          }}
          render={({ field }) => (
            <select
              {...field}
              aria-invalid={shouldShowProgramError}
              aria-describedby={programDescribedBy}
              onChange={(event) => {
                field.onChange(event)
                setProgram(event.target.value as Program | '')
              }}
              ref={(node) => {
                field.ref(node)
                programSelectRef.current = node
              }}
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
          )}
        />
      </label>
      {errors.program || shouldShowProgramError ? (
        <p id={programErrorId} className={styles.error}>
          {errors.program?.message ?? 'Выберите льготную программу'}
        </p>
      ) : null}

      {hasDraft ? (
        <p className={styles.draftStatus} role="status" aria-live="polite">
          Черновик сохранен в браузере.
        </p>
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
          ref={fileInputRef}
          multiple
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
          aria-describedby={filesDescribedBy}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(Array.from(event.target.files))
              event.target.value = ''
            }
          }}
        />
      </label>
      {shouldShowFilesError ? (
        <p id={filesErrorId} className={styles.error}>
          Добавьте хотя бы один документ для проверки.
        </p>
      ) : selectedFiles.length === 0 ? (
        <p className={styles.hint}>Добавьте хотя бы один документ.</p>
      ) : null}

      {fileIssues.length > 0 ? (
        <div id={filesIssuesId} className={styles.errorList} role="alert">
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
        uploadProgress={uploadProgress}
      />

      {createCheckMutation.isError ? (
        <p className={styles.error}>{createCheckMutation.error.message}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitDisabled}
        title={fileIssues.length > 0 ? 'Исправьте ошибки в выбранных файлах' : undefined}
      >
        {createCheckMutation.isPending ? 'Проверяем...' : 'Запустить проверку'}
      </Button>
    </form>
  )
}
