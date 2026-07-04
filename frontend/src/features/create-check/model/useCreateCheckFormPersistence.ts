import { useEffect, useState } from 'react'
import { useCreateCheckFormStore } from './createCheckFormStore'
import {
  clearPersistedCreateCheckFormState,
  loadPersistedCreateCheckFormState,
  savePersistedCreateCheckFormState,
} from '../lib/createCheckFormPersistence'

export function useCreateCheckFormPersistence() {
  const hydrate = useCreateCheckFormStore((state) => state.hydrate)
  const program = useCreateCheckFormStore((state) => state.program)
  const selectedFiles = useCreateCheckFormStore((state) => state.selectedFiles)
  const isSubmitAttempted = useCreateCheckFormStore((state) => state.isSubmitAttempted)
  const result = useCreateCheckFormStore((state) => state.result)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let isActive = true

    void (async () => {
      try {
        const persistedState = await loadPersistedCreateCheckFormState()

        if (!isActive) {
          return
        }

        if (persistedState) {
          hydrate(persistedState)
        }
      } finally {
        if (isActive) {
          setIsHydrated(true)
        }
      }
    })()

    return () => {
      isActive = false
    }
  }, [hydrate])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const hasMeaningfulDraft = Boolean(program || selectedFiles.length || result || isSubmitAttempted)

    if (!hasMeaningfulDraft) {
      void clearPersistedCreateCheckFormState().catch(() => undefined)
      return
    }

    void savePersistedCreateCheckFormState({
      program,
      selectedFiles,
      isSubmitAttempted,
      result,
    }).catch(() => undefined)
  }, [isHydrated, isSubmitAttempted, program, result, selectedFiles])
}
