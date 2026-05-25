window.firebaseAuth = {
    _authStateRef: null,
    _unsubscribe: null,

    signInWithGoogle: async function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        var result = await firebase.auth().signInWithPopup(provider);
        return this._mapUser(result.user);
    },

    signInWithGithub: async function () {
        var provider = new firebase.auth.GithubAuthProvider();
        var result = await firebase.auth().signInWithPopup(provider);
        return this._mapUser(result.user);
    },

    signOut: function () {
        return firebase.auth().signOut();
    },

    getCurrentUser: function () {
        var user = firebase.auth().currentUser;
        return user ? this._mapUser(user) : null;
    },

    onAuthStateChanged: function (dotNetRef) {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
        this._authStateRef = dotNetRef;
        this._unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            if (dotNetRef) {
                var mapped = user ? window.firebaseAuth._mapUser(user) : null;
                dotNetRef.invokeMethodAsync('OnAuthStateChangedCallback', mapped);
            }
        });
    },

    disposeAuthListener: function () {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
        }
        this._authStateRef = null;
    },

    waitForAuthReady: function () {
        return new Promise(function (resolve) {
            var unsub = firebase.auth().onAuthStateChanged(function (user) {
                unsub();
                resolve(user ? window.firebaseAuth._mapUser(user) : null);
            });
        });
    },

    _mapUser: function (user) {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
        };
    }
};

window.firebaseDb = {
    getDoc: async function (path) {
        var doc = await firebase.firestore().doc(path).get();
        return doc.exists ? JSON.stringify(doc.data()) : null;
    },

    setDoc: async function (path, jsonData) {
        var data = JSON.parse(jsonData);
        await firebase.firestore().doc(path).set(data);
    },

    deleteDoc: async function (path) {
        await firebase.firestore().doc(path).delete();
    },

    getCollection: async function (path) {
        var snapshot = await firebase.firestore().collection(path).get();
        var results = [];
        snapshot.forEach(function (doc) {
            results.push({ id: doc.id, data: JSON.stringify(doc.data()) });
        });
        return JSON.stringify(results);
    },

    batchSetDocs: async function (collectionPath, jsonDocsArray) {
        var docs = JSON.parse(jsonDocsArray);
        var db = firebase.firestore();
        var batchSize = 500;

        for (var i = 0; i < docs.length; i += batchSize) {
            var batch = db.batch();
            var chunk = docs.slice(i, i + batchSize);
            for (var j = 0; j < chunk.length; j++) {
                var ref = db.collection(collectionPath).doc(chunk[j].id);
                batch.set(ref, chunk[j].data);
            }
            await batch.commit();
        }
    },

    deleteCollection: async function (collectionPath) {
        var db = firebase.firestore();
        var snapshot = await db.collection(collectionPath).get();
        if (snapshot.empty) return;

        var batchSize = 500;
        var docs = snapshot.docs;

        for (var i = 0; i < docs.length; i += batchSize) {
            var batch = db.batch();
            var chunk = docs.slice(i, i + batchSize);
            for (var j = 0; j < chunk.length; j++) {
                batch.delete(chunk[j].ref);
            }
            await batch.commit();
        }
    },

    updateDocFields: async function (path, jsonFields) {
        var fields = JSON.parse(jsonFields);
        await firebase.firestore().doc(path).update(fields);
    }
};
