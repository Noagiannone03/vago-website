import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCyj-gXXy-XuULtHmOnFhS7sVRbB71vIDk",
  authDomain: "vago-7aba9.firebaseapp.com",
  projectId: "vago-7aba9",
  storageBucket: "vago-7aba9.firebasestorage.app",
  messagingSenderId: "549612267267",
  appId: "1:549612267267:web:e39d7c4b5ecc79fc0e4e5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
