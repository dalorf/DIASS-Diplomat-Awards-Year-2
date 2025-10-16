
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove, off } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD1tYPF1ZlGAe7gzXxlo6rjw2QMeaZ_MHo",
    authDomain: "diass-year-2-dipards.firebaseapp.com",
    databaseURL: "https://diass-year-2-dipards-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "diass-year-2-dipards",
    storageBucket: "diass-year-2-dipards.firebasestorage.app",
    messagingSenderId: "1093369035381",
    appId: "1:1093369035381:web:129a5fb1b1a029efa3963c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, onValue, remove, off };
