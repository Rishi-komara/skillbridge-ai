import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyA71OdKxhd2MXmj_7xgOa26JcVFA7jSt3A',
  authDomain: 'skillbridge-ai-b3654.firebaseapp.com',
  databaseURL: 'https://skillbridge-ai-b3654-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'skillbridge-ai-b3654',
  storageBucket: 'skillbridge-ai-b3654.firebasestorage.app',
  messagingSenderId: '354606161039',
  appId: '1:354606161039:web:19dca18f21860a24dd24fa',
  measurementId: 'G-DWCF21GQJD',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
