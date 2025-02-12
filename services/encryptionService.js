const CryptoJS = require('crypto-js');

// تشفير نص
function encryptMessage(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}

// فك التشفير
function decryptMessage(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// تجزئة النص
function hashMessage(message) {
  return CryptoJS.SHA256(message).toString();
}

// استخدام خوارزمية AES للتشفير
const ENCRYPTION_KEY = 'your-secret-key-32chars-required!!'; // يجب تغييرها في الإنتاج

const encryptionService = {
  // تشفير البيانات
  encrypt: async (data) => {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      
      // في الويب نستخدم Web Crypto API
      if (Platform.OS === 'web') {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        
        const key = await crypto.subtle.importKey(
          'raw',
          encoder.encode(ENCRYPTION_KEY),
          { name: 'AES-GCM' },
          false,
          ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          dataBuffer
        );
        
        return JSON.stringify({
          data: Array.from(new Uint8Array(encryptedData)),
          iv: Array.from(iv)
        });
      } 
      // في التطبيق الأصلي نستخدم expo-crypto
      else {
        const { encryptAsync } = require('expo-crypto');
        return await encryptAsync(data, ENCRYPTION_KEY);
      }
    } catch (error) {
      console.error('خطأ في تشفير البيانات:', error);
      return data; // في حالة الخطأ نعيد البيانات كما هي
    }
  },

  // فك تشفير البيانات
  decrypt: async (encryptedData) => {
    try {
      if (!encryptedData) return null;
      
      // في الويب
      if (Platform.OS === 'web') {
        const { data, iv } = JSON.parse(encryptedData);
        
        const decoder = new TextDecoder();
        const key = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(ENCRYPTION_KEY),
          { name: 'AES-GCM' },
          false,
          ['decrypt']
        );
        
        const decryptedData = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: new Uint8Array(iv) },
          key,
          new Uint8Array(data)
        );
        
        return decoder.decode(decryptedData);
      } 
      // في التطبيق الأصلي
      else {
        const { decryptAsync } = require('expo-crypto');
        return await decryptAsync(encryptedData, ENCRYPTION_KEY);
      }
    } catch (error) {
      console.error('خطأ في فك تشفير البيانات:', error);
      return encryptedData; // في حالة الخطأ نعيد البيانات المشفرة كما هي
    }
  }
};

export default encryptionService; 