// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

// إعدادات Firebase
const firebaseConfig = {
  // apiKey: "AIzaSyC-PXm_Wkq-HZe1uTrMni3VEtzjz9UkC_U",
  apiKey: "AIzaSyB2pRuq3eF_2jC9k9d4dcKP0XGwrf-KCRg",
  authDomain: "taswiqi-c0b96.firebaseapp.com",
  projectId: "taswiqi-c0b96",
  storageBucket: "taswiqi-c0b96.firebasestorage.app",
  messagingSenderId: "904888147619",
  appId: "1:904888147619:web:55987edd61939026f0a916",
  measurementId: "G-FQE17RSC08"
};

const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

// دالة لطلب الإذن وإنشاء التوكن
export const generateFCMToken = async (): Promise<string | undefined> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BGD6WhupkHIlzZGsxgyp5lXCsUOLe7DogNpUbmerkOf47ZR4afxNVAT0vKsSlm-V8RyTKup1gKaV2sxGjLcBa5k" // استبدله بمفتاح VAPID الحقيقي
      });
      console.log("FCM Token111:", token);
      if (token) {
        localStorage.setItem("fcmToken", token);
        return token;
      }
    }
  } catch (error) {
    console.error("حدث خطأ أثناء توليد التوكن:", error);
  }
  return undefined;
};

export { messaging };
