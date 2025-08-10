// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB2pRuq3eF_2jC9k9d4dcKP0XGwrf-KCRg",
  authDomain: "taswiqi-c0b96.firebaseapp.com",
  projectId: "taswiqi-c0b96",
  storageBucket: "taswiqi-c0b96.firebasestorage.app",
  messagingSenderId: "904888147619",
  appId: "1:904888147619:web:55987edd61939026f0a916",
  measurementId: "G-FQE17RSC08"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };