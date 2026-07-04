import { create } from 'zustand'
import type { CheckResult, Program } from '@/entities/check'

type CreateCheckFormStore = {
  program: Program | ''
  selectedFiles: File[]
  isSubmitAttempted: boolean
  result: CheckResult | null
  setProgram: (program: Program | '') => void
  setSelectedFiles: (files: File[]) => void
  addFiles: (files: File[]) => void
  removeFile: (file: File) => void
  clearFiles: () => void
  setSubmitAttempted: (value: boolean) => void
  setResult: (result: CheckResult | null) => void
  reset: () => void
}

const initialState = {
  program: '' as Program | '',
  selectedFiles: [] as File[],
  isSubmitAttempted: false,
  result: null as CheckResult | null,
}

export const useCreateCheckFormStore = create<CreateCheckFormStore>((set) => ({
  ...initialState,
  setProgram: (program) =>
    set((state) => ({
      ...state,
      program,
      result: state.result ? null : state.result,
    })),
  setSelectedFiles: (files) =>
    set((state) => ({
      ...state,
      selectedFiles: files,
      result: state.result ? null : state.result,
    })),
  addFiles: (files) =>
    set((state) => ({
      ...state,
      selectedFiles: [...state.selectedFiles, ...files],
      result: state.result ? null : state.result,
    })),
  removeFile: (file) =>
    set((state) => ({
      ...state,
      selectedFiles: state.selectedFiles.filter((currentFile) => currentFile !== file),
      result: state.result ? null : state.result,
    })),
  clearFiles: () =>
    set((state) => ({
      ...state,
      selectedFiles: [],
      result: state.result ? null : state.result,
    })),
  setSubmitAttempted: (value) => set((state) => ({ ...state, isSubmitAttempted: value })),
  setResult: (result) => set((state) => ({ ...state, result })),
  reset: () => set(initialState),
}))
