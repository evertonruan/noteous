const DB_NAME = 'NoteousIDB';
const DB_VERSION = 1;
const NOTES_STORE = 'notes-store';

let db;
let dbPromise = null;

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Store for notes
      if (!database.objectStoreNames.contains(NOTES_STORE)) {
        const store = database.createObjectStore(NOTES_STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('editedAt', 'editedAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      dbPromise = null; // Reset promise on error to allow retry
      reject(event.target.error);
    };
  });

  return dbPromise;
}

/**
 * Gets the settings object from LocalStorage.
 */
export function getSettings() {
  const settings = localStorage.getItem('noteous-settings');
  return settings ? JSON.parse(settings) : null;
}

/**
 * Saves the settings object to LocalStorage.
 */
export function saveSettings(settings) {
  localStorage.setItem('noteous-settings', JSON.stringify(settings));
}

/**
 * Gets a single note by ID.
 */
export async function getNote(id) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}



/**
 * Gets all notes from the database.
 * @param {string} [indexName] - Optional index name to sort by (e.g., 'createdAt', 'editedAt').
 * @param {IDBCursorDirection} [direction='next'] - Sort direction ('next' or 'prev').
 */
export async function getAllNotes(indexName, direction = 'next') {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    
    if (indexName && store.indexNames.contains(indexName)) {
      const index = store.index(indexName);
      const results = [];
      const request = index.openCursor(null, direction);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    } else {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }
  });
}

/**
 * Returns the number of notes stored in the database.
 * @returns {Promise<number>}
 */
export async function getNotesCount() {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Adds a new note to the database.
 */
export async function addNote(noteData) {
  const database = await initDB();
  const note = {
    ...noteData,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.add(note);

    request.onsuccess = () => resolve(note);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Updates an existing note in the database.
 */
export async function updateNote(note) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.put(note);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes a note from the database.
 */
export async function deleteNote(id) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clears all notes.
 */
export async function clearAllNotes() {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves multiple notes at once (used for import).
 */
export async function saveAllNotes(notes) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    
    notes.forEach(note => {
      // Ensure notes have the new structure if they don't
      if (!note.id || typeof note.id !== 'string') {
        const oldId = note.id;
        note.id = crypto.randomUUID();
        note.createdAt = typeof oldId === 'number' ? oldId : Date.now();
      }
      store.put(note);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
