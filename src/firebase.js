import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyApkAMW1Dn0JuhfiqWTUkQgm4Q5XPJxN1o",
    authDomain: "uberdriverapp-aa1e5.firebaseapp.com",
    projectId: "uberdriverapp-aa1e5",
    storageBucket: "uberdriverapp-aa1e5.appspot.com",
    messagingSenderId: "763509665644",
    appId: "1:763509665644:web:914a49764bb019cca40d49",
    measurementId: "G-Z6M9Q88Z9K"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };