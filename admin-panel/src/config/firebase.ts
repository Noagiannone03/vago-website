import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBw1VC9TgX3WvpqP5vxMy77bJnEWD1-xMg",
  authDomain: "vagoapp-cd044.firebaseapp.com",
  projectId: "vagoapp-cd044",
  storageBucket: "vagoapp-cd044.firebasestorage.app",
  messagingSenderId: "88933758360",
  appId: "1:88933758360:web:45f6b0af88e29b73adaa22"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
