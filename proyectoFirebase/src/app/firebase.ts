// src/app/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBko6PFIC3QOZ3CXtsyN-4vrFJR2ooAeas",
  authDomain: "appmoviles-b5003.firebaseapp.com",
  projectId: "appmoviles-b5003",
  storageBucket: "appmoviles-b5003.firebasestorage.app",
  messagingSenderId: "264276022373",
  appId: "1:264276022373:web:66db567fd6ee7d225b628c",
  measurementId: "G-RXGREWNXX8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
