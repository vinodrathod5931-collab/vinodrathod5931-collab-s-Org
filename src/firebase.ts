import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYWMh0nK6CTSBkMWbWtt3NNSJJBsPqudQ",
  authDomain: "agritrade-d4f49.firebaseapp.com",
  projectId: "agritrade-d4f49",
  storageBucket: "agritrade-d4f49.firebasestorage.app",
  messagingSenderId: "45933099531",
  appId: "1:45933099531:web:10e65dfd9b7125cd02650e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
