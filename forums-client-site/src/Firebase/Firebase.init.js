
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAdnZWhj57FbGXcc8RnoGcvqv4gZ1n8do",
  authDomain: "forum-project-ee65e.firebaseapp.com",
  projectId: "forum-project-ee65e",
  storageBucket: "forum-project-ee65e.firebasestorage.app",
  messagingSenderId: "775610085185",
  appId: "1:775610085185:web:89ede10dc6638474d73bc0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);