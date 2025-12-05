
import type { Persistence } from './persistence';

const DB_NAME = 'superscript-cleaner';
const STORE_NAME = 'drafts';

type DBGetter = () => Promise<IDBDatabase>;

let dbPromise: Promise<IDBDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
      };
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB.'));
    };
  });
}

function getDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

const createIndexedDBPersistence = (getDB: DBGetter): Persistence => {
  const run = async <T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> => {
    const db = await getDB();

    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = operation(store);

      transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
      transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
    });
  };

  return {
    async setItem(key, value) {
      await run('readwrite', (store) => store.put(value, key));
    },
    async getItem(key) {
      const result = await run('readonly', (store) => store.get(key));
      return (result as string | undefined) ?? null;
    },
    async removeItem(key) {
      await run('readwrite', (store) => store.delete(key));
    },
    async clear() {
      await run('readwrite', (store) => store.clear());
    },
  };
};

export function ensurePersistentStorage(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.persistentStorage) {
      window.__persistenceBackend = window.__persistenceBackend ?? 'native';
      return;
    }

    if (!('indexedDB' in window) || !window.indexedDB) {
      window.__persistenceBackend = 'memory';
      console.warn(
        'IndexedDB is unavailable in this environment. Drafts will only persist for the current session.'
      );
      return;
    }

    try {
      await getDatabase();
      window.persistentStorage = createIndexedDBPersistence(getDatabase);
      window.__persistenceBackend = 'indexedDB';
    } catch (error) {
      window.persistentStorage = undefined;
      window.__persistenceBackend = 'memory';
      console.warn('Failed to initialize IndexedDB persistence. Drafts will be session-only.', error);
    }
  })();

  return initializationPromise;
}
