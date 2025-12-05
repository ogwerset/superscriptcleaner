
type Persistence = {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
};

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

if (typeof window !== 'undefined' && window.persistentStorage) {
  backend = window.persistentStorage;
} else if (typeof window !== 'undefined') {
  console.warn(
    'window.persistentStorage is unavailable in this environment. Drafts will only persist for this session.'
  );
}

export const persistence: Persistence = backend;
