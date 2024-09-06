import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBOkp5nKd5qpHiAjkx-L6KQck-HSHXMy-U",
  authDomain: "apponta-417e4.firebaseapp.com",
  projectId: "apponta-417e4",
  storageBucket: "apponta-417e4.appspot.com",
  messagingSenderId: "648823942949",
  appId: "1:648823942949:web:d2a3ff5061b8aae88bf4cc"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtén la instancia de autenticación
export const auth = getAuth(app);
