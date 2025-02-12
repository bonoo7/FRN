import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { questions as allQuestions } from '../data/questions';
import { validateGameData as validateGame } from './gameService';

const STORAGE_KEYS = {
  CURRENT_GAME: 'currentGame',
  GAME_HISTORY: 'gameHistory',
  STATISTICS: 'statistics',
  USED_QUESTIONS: 'usedQuestions',
  SETTINGS: 'settings',
  QUESTION_CYCLE: 'questionCycle'
};

const storage = AsyncStorage;

// إضافة تشفير للبيانات المحفوظة
const secureStorage = {
  setItem: async (key, value) => {
    const encryptedValue = await encryptionService.encrypt(value);
    return storage.setItem(key, encryptedValue);
  },
  getItem: async (key) => {
    const encryptedValue = await storage.getItem(key);
    return encryptionService.decrypt(encryptedValue);
  }
};

export const StorageService = {
  // حفظ بيانات الجولة الحالية
  saveCurrentGame: async (gameData) => {
    try {
      console.log('Attempting to save game data:', gameData);
      gameData = validateGame(gameData);

      // تأكد من وجود حالة استخدام المضاعفة
      gameData.usedDoublePoints = gameData.usedDoublePoints || {};

      await storage.setItem(
        STORAGE_KEYS.CURRENT_GAME,
        JSON.stringify({
          ...gameData,
          timestamp: new Date().toISOString()
        })
      );
      console.log('Game data saved successfully to storage');
      return true;
    } catch (error) {
      console.error('Error saving current game:', error.message, error);
      throw error;
    }
  },

  // استرجاع اللعبة الحالية
  getCurrentGame: async () => {
    try {
      console.log('Attempting to get current game');
      const gameData = await storage.getItem(STORAGE_KEYS.CURRENT_GAME);
      console.log('Raw game data from storage:', gameData);
      
      if (!gameData) {
        console.log('No game data found in storage');
        return null;
      }

      const parsedData = validateGame(JSON.parse(gameData));
      console.log('Parsed game data:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error getting current game:', error.message, error);
      return null;
    }
  },

  // حفظ الأسئلة المستخدمة
  saveUsedQuestion: async (questionData) => {
    try {
      const currentCycle = await StorageService.getQuestionCycle();
      const usedQuestions = await StorageService.getUsedQuestions();
      
      // إضافة السؤال مع رقم الدورة
      usedQuestions.push({
        ...questionData,
        cycle: currentCycle,
        timestamp: new Date().toISOString()
      });

      await storage.setItem(STORAGE_KEYS.USED_QUESTIONS, JSON.stringify(usedQuestions));
    } catch (error) {
      console.error('Error saving used question:', error);
    }
  },

  // استرجاع الأسئلة المستخدمة
  getUsedQuestions: async () => {
    try {
      const questions = await storage.getItem(STORAGE_KEYS.USED_QUESTIONS);
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error('Error getting used questions:', error);
      return [];
    }
  },

  // حفظ الجولة في السجل التاريخي
  saveGameToHistory: async (gameData) => {
    try {
      const history = await StorageService.getGameHistory();
      const gameEntry = {
        id: Date.now().toString(),
        roundName: gameData.roundName || 'جولة بدون اسم',
        teams: gameData.teams || [],
        categories: gameData.categories || [],
        scores: gameData.scores || {},
        timestamp: new Date().toISOString()
      };
      
      history.push(gameEntry);
      await storage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
      console.log('تم حفظ الجولة في التاريخ:', gameEntry); // للتأكد من البيانات
    } catch (error) {
      console.error('Error saving game to history:', error);
    }
  },

  // استرجاع تاريخ الألعاب
  getGameHistory: async () => {
    try {
      const history = await storage.getItem(STORAGE_KEYS.GAME_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting game history:', error);
      return [];
    }
  },

  // تحديث الإحصائيات
  updateStatistics: async (gameData) => {
    try {
      if (!gameData || !gameData.scores) {
        console.error('بيانات غير صالحة للإحصائيات:', gameData);
        return {
          totalGames: 0,
          teamStats: {}
        };
      }

      const stats = await StorageService.getStatistics();
      stats.totalGames = (stats.totalGames || 0) + 1;
      
      // تحديث إحصائيات الفرق
      if (!stats.teamStats) stats.teamStats = {};
      
      Object.entries(gameData.scores).forEach(([team, score]) => {
        if (!stats.teamStats[team]) {
          stats.teamStats[team] = { 
            totalGames: 0,
            totalScore: 0,
            wins: 0
          };
        }
        stats.teamStats[team].totalGames++;
        stats.teamStats[team].totalScore += score;
        if (gameData.winners && gameData.winners.includes(team)) {
          stats.teamStats[team].wins++;
        }
      });

      await storage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error('Error updating statistics:', error);
      return {
        totalGames: 0,
        teamStats: {}
      };
    }
  },

  // استرجاع الإحصائيات
  getStatistics: async () => {
    try {
      const stats = await storage.getItem(STORAGE_KEYS.STATISTICS);
      return stats ? JSON.parse(stats) : {
        totalGames: 0,
        teamStats: {}
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalGames: 0,
        teamStats: {}
      };
    }
  },

  // مسح كل البيانات
  clearAllData: async () => {
    try {
      await storage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  // إضافة دالة للتحقق من الأسئلة المستخدمة
  isQuestionUsed: async (questionId) => {
    try {
      const usedQuestions = await StorageService.getUsedQuestions();
      return usedQuestions.some(q => q.id === questionId);
    } catch (error) {
      console.error('Error checking used question:', error);
      return false;
    }
  },

  // إضافة دالة لمسح الأسئلة القديمة
  clearOldQuestions: async (daysToKeep = 7) => {
    try {
      const usedQuestions = await StorageService.getUsedQuestions();
      const now = new Date();
      const filteredQuestions = usedQuestions.filter(q => {
        const questionDate = new Date(q.timestamp);
        const diffTime = Math.abs(now - questionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysToKeep;
      });
      await StorageService.setUsedQuestions(filteredQuestions);
    } catch (error) {
      console.error('Error clearing old questions:', error);
    }
  },

  // إضافة دالة للتحقق من عدد الأسئلة المتبقية
  getAvailableQuestionsCount: async (category, difficulty) => {
    try {
      const usedQuestions = await StorageService.getUsedQuestions();
      const usedCount = usedQuestions.filter(q => 
        q.category === category && 
        q.difficulty === difficulty
      ).length;
      const totalQuestions = allQuestions.filter(q => 
        q.category === category && 
        q.difficulty === difficulty
      ).length;
      return totalQuestions - usedCount;
    } catch (error) {
      console.error('Error getting available questions count:', error);
      return 0;
    }
  },

  // إضافة دالة لتتبع دورات الأسئلة
  getQuestionCycle: async () => {
    try {
      const cycle = await storage.getItem(STORAGE_KEYS.QUESTION_CYCLE);
      return cycle ? parseInt(cycle) : 1;
    } catch (error) {
      console.error('Error getting question cycle:', error);
      return 1;
    }
  },

  // التحقق من توفر الأسئلة في الفئة
  checkCategoryAvailability: async (category) => {
    try {
      // الحصول على أسئلة الفئة
      const categoryQuestions = allQuestions.filter(q => q.category === category);
      
      if (!categoryQuestions || categoryQuestions.length === 0) {
        return {
          availableQuestions: 0,
          needsNewCycle: false,
          error: 'لا توجد أسئلة متوفرة لهذه الفئة'
        };
      }

      // الحصول على الأسئلة المستخدمة
      const usedQuestions = await StorageService.getUsedQuestions() || [];
      const currentCycle = await StorageService.getQuestionCycle();
      
      // عدد الأسئلة المستخدمة في الدورة الحالية
      const usedInCurrentCycle = usedQuestions.filter(q => 
        q.category === category && 
        q.cycle === currentCycle
      ).length;

      return {
        availableQuestions: categoryQuestions.length - usedInCurrentCycle,
        totalQuestions: categoryQuestions.length,
        needsNewCycle: false
      };
    } catch (error) {
      console.error('خطأ في فحص توفر الأسئلة:', error);
      return {
        availableQuestions: 0,
        needsNewCycle: false,
        error: 'حدث خطأ أثناء فحص الأسئلة'
      };
    }
  },

  // حفظ الإعدادات
  saveSettings: async (settings) => {
    try {
      await storage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      return false;
    }
  },

  // مسح بيانات اللعبة الحالية
  clearCurrentGame: async () => {
    try {
      await storage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      return true;
    } catch (error) {
      console.error('Error clearing current game:', error);
      throw error;
    }
  },

  // جلب الإعدادات
  getSettings: async () => {
    try {
      const settings = await storage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : { rewardsEnabled: true };
    } catch (error) {
      console.error('خطأ في جلب الإعدادات:', error);
      return { rewardsEnabled: true };
    }
  },

  getThemePreferences: async () => {
    try {
      const prefs = await AsyncStorage.getItem('themePreferences');
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error('Error getting theme preferences:', error);
      return null;
    }
  },

  saveGameResults: async (gameData) => {
    try {
      if (!gameData || !gameData.scores || !gameData.teams) {
        throw new Error('بيانات اللعبة غير مكتملة');
      }

      // حفظ بيانات الجولة في التاريخ
      await StorageService.saveGameToHistory({
        roundName: gameData.roundName,
        teams: gameData.teams,
        scores: gameData.scores,
        winners: gameData.winners,
        timestamp: new Date().toISOString()
      });

      // تحديث الإحصائيات
      await StorageService.updateStatistics({
        winners: gameData.winners,
        scores: gameData.scores
      });

      return true;
    } catch (error) {
      console.error('خطأ في حفظ نتائج اللعبة:', error);
      throw error;
    }
  },

  // الحصول على سؤال عشوائي من الفئة
  getRandomQuestion: async (category, difficulty) => {
    try {
      // الحصول على جميع الأسئلة المتاحة في الفئة والمستوى
      const availableQuestions = allQuestions.filter(q => 
        q.category === category && 
        q.difficulty === difficulty
      );

      // الحصول على الأسئلة المستخدمة
      const usedQuestions = await StorageService.getUsedQuestions() || [];
      const currentCycle = await StorageService.getQuestionCycle();

      // استبعاد الأسئلة المستخدمة في الدورة الحالية
      const unusedQuestions = availableQuestions.filter(q => 
        !usedQuestions.some(uq => 
          uq.category === category && 
          uq.difficulty === difficulty && 
          uq.questionId === q.id && 
          uq.cycle === currentCycle
        )
      );

      if (unusedQuestions.length === 0) {
        return null;
      }

      // اختيار سؤال عشوائي
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      return unusedQuestions[randomIndex];
    } catch (error) {
      console.error('خطأ في الحصول على سؤال عشوائي:', error);
      return null;
    }
  },
}; 