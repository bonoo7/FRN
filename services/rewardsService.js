import { StorageService } from './storageService';

const STORAGE_KEYS = {
  REWARD_HISTORY: 'rewardHistory'
};

const RewardsService = {
  calculateBonus: (streak) => {
    return Math.floor(streak * 1.5);
  },
  
  applyStreak: (currentScore, streak) => {
    const bonus = RewardsService.calculateBonus(streak);
    return currentScore + bonus;
  },

  calculateTimeBonus: (timeLeft, maxTime, basePoints) => {
    const timePercentage = timeLeft / maxTime;
    
    // حساب أقصى مكافأة (10% من النقاط الأساسية)
    const maxBonus = Math.floor(basePoints * 0.1);
    
    if (timePercentage >= 0.75) {
      // 100% من المكافأة القصوى
      return {
        bonus: maxBonus,
        message: `تثبيت سريع جداً! +${maxBonus} نقطة إضافية`
      };
    }
    if (timePercentage >= 0.5) {
      // 75% من المكافأة القصوى
      const bonus = Math.floor(maxBonus * 0.75);
      return {
        bonus,
        message: `تثبيت سريع! +${bonus} نقطة إضافية`
      };
    }
    if (timePercentage >= 0.25) {
      // 50% من المكافأة القصوى
      const bonus = Math.floor(maxBonus * 0.5);
      return {
        bonus,
        message: `تثبيت جيد! +${bonus} نقاط إضافية`
      };
    }
    // لا مكافأة للتثبيت المتأخر
    return {
      bonus: 0,
      message: null
    };
  },

  saveRewardHistory: async (teamName, rewardData) => {
    try {
      // الحصول على تاريخ اللعبة الحالي
      let history = await StorageService.getGameHistory();
      if (!history) {
        history = {
          rewards: {},
          timestamp: new Date().toISOString()
        };
      }

      // التأكد من وجود كائن المكافآت
      if (!history.rewards) {
        history.rewards = {};
      }

      // التأكد من وجود مصفوفة للفريق
      if (!history.rewards[teamName]) {
        history.rewards[teamName] = [];
      }

      // إضافة المكافأة الجديدة
      history.rewards[teamName].push({
        ...rewardData,
        timestamp: new Date().toISOString()
      });

      // حفظ التاريخ المحدث
      await StorageService.saveGameToHistory(history);
      
      return true;
    } catch (error) {
      console.error('خطأ في حفظ سجل المكافآت:', error);
      return false;
    }
  },

  getTeamTotalBonus: async (teamName) => {
    try {
      const history = await StorageService.getGameHistory();
      if (!history || !history.rewards || !history.rewards[teamName]) {
        return 0;
      }

      return history.rewards[teamName].reduce((total, reward) => {
        return total + (reward.bonus || 0);
      }, 0);
    } catch (error) {
      console.error('خطأ في حساب إجمالي المكافآت:', error);
      return 0;
    }
  }
};

export default RewardsService; 