// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2pRuq3eF_2jC9k9d4dcKP0XGwrf-KCRg",
  authDomain: "taswiqi-c0b96.firebaseapp.com",
  projectId: "taswiqi-c0b96",
  storageBucket: "taswiqi-c0b96.firebasestorage.app",
  messagingSenderId: "904888147619",
  appId: "1:904888147619:web:55987edd61939026f0a916",
  measurementId: "G-FQE17RSC08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

// متغير لتتبع ما إذا تم طلب الإذن من قبل في هذه الجلسة
let permissionRequested = false;

/**
 * يعرض رسالة توجيهية للمستخدم عند رفض الإذن
 */
const showPermissionInstructions = () => {
  // يمكن استبدال هذا بعنصر واجهة مستخدم أفضل
  const permissionMessage = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 300px;
      z-index: 1000;
    ">
      <h3 style="margin-top: 0;">تمكين الإشعارات</h3>
      <p>يبدو أنك رفضت إذن الإشعارات. لتلقي التنبيهات المهمة:</p>
      <ol style="padding-left: 20px;">
        <li>انقر على رمز القفل 🔒 او ℹ️ بجوار عنوان الموقع</li>
        <li>اختر "إعدادات الموقع"</li>
        <li>غيّر خيار "الإشعارات" إلى "السماح"</li>
      </ol>
      <button onclick="this.parentElement.remove()" style="
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">فهمت</button>
    </div>
  `;

  const messageContainer = document.createElement('div');
  messageContainer.innerHTML = permissionMessage;
  document.body.appendChild(messageContainer);
};

/**
 * يحاول الحصول على FCM token مع إدارة حالات الإذن
 */
export const generateFCMToken = async (): Promise<string | undefined> => {
  try {
    // إذا كان الإذن ممنوحًا بالفعل
    if (Notification.permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: "BGD6WhupkHIlzZGsxgyp5lXCsUOLe7DogNpUbmerkOf47ZR4afxNVAT0vKsSlm-V8RyTKup1gKaV2sxGjLcBa5k"
      });
      
      if (token) {
        localStorage.setItem("fcmToken", token);
        return token;
      }
    }
    // إذا كان الإذن مرفوضًا
    else if (Notification.permission === 'denied') {
      console.warn('تم رفض إذن الإشعارات من قبل المستخدم');
      
      // تحقق إذا كنا قد عرضنا التعليمات من قبل
      const instructionsShown = localStorage.getItem('notificationInstructionsShown');
      showPermissionInstructions();
      localStorage.setItem('notificationInstructionsShown', 'true');
      if (!instructionsShown) {
      }
      
      return undefined;
    }
    // إذا لم يتم طلب الإذن بعد
    else if (!permissionRequested) {
      permissionRequested = true;
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BGD6WhupkHIlzZGsxgyp5lXCsUOLe7DogNpUbmerkOf47ZR4afxNVAT0vKsSlm-V8RyTKup1gKaV2sxGjLcBa5k"
        });
        
        if (token) {
          localStorage.setItem("fcmToken", token);
          return token;
        }
      }
    }
  } catch (error) {
    console.error("حدث خطأ أثناء توليد التوكن:", error);
  }
  
  return undefined;
};

/**
 * تهيئة خدمة الإشعارات
 */
export const initializeNotifications = () => {
  // تحقق من وجود token مخزن
  const storedToken = localStorage.getItem("fcmToken");
  
  if (storedToken) {
    console.log('Token موجود بالفعل:', storedToken);
    return Promise.resolve(storedToken);
  }
  
  // إذا لم يكن هناك token، حاول الحصول على واحد
  return generateFCMToken();
};

// تصدير كائن messaging للاستخدام في أجزاء أخرى من التطبيق
export { messaging };