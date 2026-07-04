import type { CheckResult, Program } from '@/entities/check'

const SNAPSHOT_STORAGE_KEY = 'create-check-form-state:v1'
const FILE_STORE_NAME = 'create-check-form-files'
const FILE_STORE_VERSION = 1
const FILE_STORE_KEY = 'files'

type StoredCreateCheckFormFile = {
  id: string
  name: string
  type: string
  lastModified: number
  blob: Blob
}

type StoredCreateCheckFormSnapshot = {
  program: Program | ''
  isSubmitAttempted: boolean
  result: CheckResult | null
  fileIds: string[]
}

export type PersistedCreateCheckFormState = {
  program: Program | ''
  isSubmitAttempted: boolean
  result: CheckResult | null
  selectedFiles: File[]
}

type PersistedCreateCheckFormStorage = {
  snapshot: StoredCreateCheckFormSnapshot | null
  files: StoredCreateCheckFormFile[]
}

const memoryStorage: PersistedCreateCheckFormStorage = {
  snapshot: null,
  files: [],
}

let indexedDbPromise: Promise<IDBDatabase | null> | null = null

function generateId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getSessionStorage() {
  try {
    return globalThis.sessionStorage
  } catch {
    return null
  }
}

function readStoredSnapshot() {
  const storage = getSessionStorage()

  if (!storage) {
    return memoryStorage.snapshot
  }

  const rawSnapshot = storage.getItem(SNAPSHOT_STORAGE_KEY)

  if (!rawSnapshot) {
    return null
  }

  try {
    const parsedSnapshot = JSON.parse(rawSnapshot) as Partial<StoredCreateCheckFormSnapshot>

    if (
      typeof parsedSnapshot.program === 'undefined' ||
      typeof parsedSnapshot.isSubmitAttempted !== 'boolean' ||
      !Array.isArray(parsedSnapshot.fileIds)
    ) {
      return null
    }

    return {
      program: parsedSnapshot.program,
      isSubmitAttempted: parsedSnapshot.isSubmitAttempted,
      result: parsedSnapshot.result ?? null,
      fileIds: parsedSnapshot.fileIds,
    }
  } catch {
    return null
  }
}

function writeStoredSnapshot(snapshot: StoredCreateCheckFormSnapshot) {
  const storage = getSessionStorage()

  if (!storage) {
    memoryStorage.snapshot = snapshot
    return
  }

  storage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot))
}

function clearStoredSnapshot() {
  const storage = getSessionStorage()

  if (!storage) {
    memoryStorage.snapshot = null
    return
  }

  storage.removeItem(SNAPSHOT_STORAGE_KEY)
}

function fileToRecord(file: File): StoredCreateCheckFormFile {
  return {
    id: generateId(),
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    blob: file.slice(0, file.size, file.type),
  }
}

function recordToFile(record: StoredCreateCheckFormFile) {
  return new File([record.blob], record.name, {
    lastModified: record.lastModified,
    type: record.type,
  })
}

function openIndexedDb() {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }

  if (!indexedDbPromise) {
    indexedDbPromise = new Promise<IDBDatabase | null>((resolve) => {
      const request = indexedDB.open(FILE_STORE_NAME, FILE_STORE_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(FILE_STORE_KEY)) {
          database.createObjectStore(FILE_STORE_KEY, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    })
  }

  return indexedDbPromise
}

async function replaceStoredFiles(records: StoredCreateCheckFormFile[]) {
  const database = await openIndexedDb()

  if (!database) {
    memoryStorage.files = records
    return
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(FILE_STORE_KEY, 'readwrite')
    const store = transaction.objectStore(FILE_STORE_KEY)

    store.clear()

    for (const record of records) {
      store.put(record)
    }

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('Не удалось сохранить файлы формы.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Не удалось сохранить файлы формы.'))
  })
}

async function loadStoredFiles(fileIds: string[]) {
  const database = await openIndexedDb()

  if (!database) {
    return fileIds
      .map((fileId) => memoryStorage.files.find((file) => file.id === fileId))
      .filter((file): file is StoredCreateCheckFormFile => Boolean(file))
  }

  return await new Promise<StoredCreateCheckFormFile[]>((resolve, reject) => {
    const transaction = database.transaction(FILE_STORE_KEY, 'readonly')
    const store = transaction.objectStore(FILE_STORE_KEY)

    const requests = fileIds.map(
      (fileId) =>
        new Promise<StoredCreateCheckFormFile | null>((resolveFile, rejectFile) => {
          const request = store.get(fileId)

          request.onsuccess = () => {
            resolveFile((request.result as StoredCreateCheckFormFile | undefined) ?? null)
          }

          request.onerror = () => {
            rejectFile(request.error ?? new Error('Не удалось загрузить файлы формы.'))
          }
        }),
    )

    Promise.all(requests)
      .then((records) => resolve(records.filter((record): record is StoredCreateCheckFormFile => Boolean(record))))
      .catch(reject)
  })
}

async function clearStoredFiles() {
  const database = await openIndexedDb()

  if (!database) {
    memoryStorage.files = []
    return
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(FILE_STORE_KEY, 'readwrite')
    const store = transaction.objectStore(FILE_STORE_KEY)

    store.clear()

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('Не удалось очистить файлы формы.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Не удалось очистить файлы формы.'))
  })
}

export async function loadPersistedCreateCheckFormState() {
  const snapshot = readStoredSnapshot()

  if (!snapshot) {
    await clearStoredFiles()
    return null
  }

  const records = await loadStoredFiles(snapshot.fileIds)

  return {
    program: snapshot.program,
    isSubmitAttempted: snapshot.isSubmitAttempted,
    result: snapshot.result,
    selectedFiles: records.map(recordToFile),
  } satisfies PersistedCreateCheckFormState
}

export async function savePersistedCreateCheckFormState(state: PersistedCreateCheckFormState) {
  const storedFiles = state.selectedFiles.map(fileToRecord)

  await replaceStoredFiles(storedFiles)
  writeStoredSnapshot({
    program: state.program,
    isSubmitAttempted: state.isSubmitAttempted,
    result: state.result,
    fileIds: storedFiles.map((file) => file.id),
  })
}

export async function clearPersistedCreateCheckFormState() {
  clearStoredSnapshot()
  await clearStoredFiles()
}
