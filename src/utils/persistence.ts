
export type Persistence = {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
};

export type PersistenceDriver = 'native' | 'indexedDB' | 'memory';

const memoryPersistence: Persistence = {
  async setItem(key, value) {
    inMemoryStore.set(key, value);
  },
  async getItem(key) {
    return inMemoryStore.has(key) ? inMemoryStore.get(key)! : null;
  },
  async removeItem(key) {
    inMemoryStore.delete(key);
  },
  async clear() {
    inMemoryStore.clear();
  },
};

const inMemoryStore = new Map<string, string>();

let backend: Persistence = memoryPersistence;
let driver: PersistenceDriver = 'memory';

if (typeof window !== 'undefined' && window.persistentStorage) {
  backend = window.persistentStorage;
  driver = (window.__persistenceBackend as PersistenceDriver) ?? 'native';
} else if (typeof window !== 'undefined') {
  driver = 'memory';
  console.warn(
    'window.persistentStorage is unavailable in this environment. Drafts will only persist for this session.'
  );
}

export const persistence: Persistence = backend;
export const persistenceDriver: PersistenceDriver = driver;
