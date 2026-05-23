window.emiEngStorage = {
    dbName: 'EmiEngDb',
    version: 1,

    _openDb: function () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('kv')) {
                    db.createObjectStore('kv');
                }
            };
        });
    },

    getItem: async function (key) {
        const db = await this._openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kv', 'readonly');
            const store = tx.objectStore('kv');
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = () => reject(req.error);
        });
    },

    setItem: async function (key, value) {
        const db = await this._openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kv', 'readwrite');
            const store = tx.objectStore('kv');
            const req = store.put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    },

    removeItem: async function (key) {
        const db = await this._openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kv', 'readwrite');
            const store = tx.objectStore('kv');
            const req = store.delete(key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    },

    clearAll: async function () {
        const db = await this._openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('kv', 'readwrite');
            const store = tx.objectStore('kv');
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    },

    deleteDatabase: async function () {
        await this.clearAll();
        return new Promise((resolve, reject) => {
            const req = indexedDB.deleteDatabase(this.dbName);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
            req.onblocked = () => resolve();
        });
    }
};
