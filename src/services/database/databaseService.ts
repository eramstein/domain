import type { GameState } from '@/types'

const DB_NAME = 'domain'
const DB_VERSION = 1
const STORE_NAME = 'saves'

export interface SaveRecord {
  name: string
  savedAt: number
  state: GameState
}

export interface SaveSummary {
  name: string
  savedAt: number
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error ?? new Error('Failed to open database'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' })
        store.createIndex('savedAt', 'savedAt')
      }
    }
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode)
        const store = tx.objectStore(STORE_NAME)
        const request = run(store)

        request.onerror = () => reject(request.error ?? new Error('Database request failed'))
        request.onsuccess = () => resolve(request.result)
        tx.oncomplete = () => db.close()
        tx.onerror = () => reject(tx.error ?? new Error('Database transaction failed'))
      }),
  )
}

export class DatabaseService {
  async saveGame(name: string, state: GameState): Promise<void> {
    const record: SaveRecord = {
      name,
      savedAt: Date.now(),
      state: structuredClone(state),
    }

    await runTransaction('readwrite', (store) => store.put(record))
  }

  async loadGame(name: string): Promise<GameState | null> {
    const record = await runTransaction<SaveRecord | undefined>('readonly', (store) =>
      store.get(name),
    )

    return record ? structuredClone(record.state) : null
  }

  async getLatestSave(): Promise<SaveRecord | null> {
    const records = await runTransaction<SaveRecord[]>('readonly', (store) => store.getAll())

    if (records.length === 0) {
      return null
    }

    const latest = records.reduce((current, candidate) =>
      candidate.savedAt > current.savedAt ? candidate : current,
    )

    return structuredClone(latest)
  }

  async listSaves(): Promise<SaveSummary[]> {
    const records = await runTransaction<SaveRecord[]>('readonly', (store) => store.getAll())

    return records
      .map(({ name, savedAt }) => ({ name, savedAt }))
      .sort((left, right) => right.savedAt - left.savedAt)
  }
}

export const databaseService = new DatabaseService()
