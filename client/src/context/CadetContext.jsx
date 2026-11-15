import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { getLocalDateString } from '../utils/dateUtils';

const CadetContext = createContext(null);

const { storageKeys } = APP_CONFIG;

const safeGetStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[CadetContext] Failed to write to localStorage for key "${key}":`, err);
  }
};

export function CadetProvider({ children }) {
  // 1. Cadet Points
  const [userPoints, setUserPoints] = useState(() => {
    try {
      return parseInt(localStorage.getItem(storageKeys.cadetPoints) || '0', 10);
    } catch {
      return 0;
    }
  });

  // 2. Unlocked Badges
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    return safeGetStorage(storageKeys.cadetBadges, []);
  });

  // 3. Completed Quizzes
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    return safeGetStorage(storageKeys.completedQuizzes, []);
  });

  // 4. Completed Simulations
  const [completedSims, setCompletedSims] = useState(() => {
    return safeGetStorage(storageKeys.completedSims, []);
  });

  // 5. Daily Streak
  const [dailyStreak, setDailyStreak] = useState(() => {
    try {
      return parseInt(localStorage.getItem(storageKeys.dailyStreak) || '0', 10);
    } catch {
      return 0;
    }
  });

  // 6. Last Daily Date
  const [lastDailyDate, setLastDailyDate] = useState(() => {
    try {
      return localStorage.getItem(storageKeys.lastDailyDate) || '';
    } catch {
      return '';
    }
  });

  // Award points on quiz completion with capped points on retakes to prevent inflation
  const awardQuizPoints = useCallback(({ quiz, passed }) => {
    if (!passed) return;

    const alreadyCompleted = completedQuizzes.includes(quiz.slug);
    // Award full badge points on first pass; +25 PTS practice bonus on subsequent retakes
    const earnedPoints = alreadyCompleted ? 25 : (quiz.badge_points || 100);
    const newPoints = userPoints + earnedPoints;

    setUserPoints(newPoints);
    try {
      localStorage.setItem(storageKeys.cadetPoints, newPoints.toString());
    } catch {
      // Storage unavailable
    }

    // Award badge if not already unlocked
    if (quiz.badge_name && !unlockedBadges.includes(quiz.badge_name)) {
      const updatedBadges = [...unlockedBadges, quiz.badge_name];
      setUnlockedBadges(updatedBadges);
      safeSetStorage(storageKeys.cadetBadges, updatedBadges);
    }

    // Record completed quiz
    if (!alreadyCompleted) {
      const updatedCompleted = [...completedQuizzes, quiz.slug];
      setCompletedQuizzes(updatedCompleted);
      safeSetStorage(storageKeys.completedQuizzes, updatedCompleted);
    }
  }, [completedQuizzes, unlockedBadges, userPoints]);

  // Award points on simulation completion
  const awardSimulationPoints = useCallback(({ sim, points, badge }) => {
    const alreadyCompleted = completedSims.includes(sim.slug);
    const earnedPoints = alreadyCompleted ? 50 : points;
    const newPoints = userPoints + earnedPoints;

    setUserPoints(newPoints);
    try {
      localStorage.setItem(storageKeys.cadetPoints, newPoints.toString());
    } catch {
      // Storage unavailable
    }

    if (badge && !unlockedBadges.includes(badge)) {
      const updatedBadges = [...unlockedBadges, badge];
      setUnlockedBadges(updatedBadges);
      safeSetStorage(storageKeys.cadetBadges, updatedBadges);
    }

    if (!alreadyCompleted) {
      const updatedSims = [...completedSims, sim.slug];
      setCompletedSims(updatedSims);
      safeSetStorage(storageKeys.completedSims, updatedSims);
    }
  }, [completedSims, unlockedBadges, userPoints]);

  // Award points on daily challenge with calendar streak continuity
  const awardDailyPoints = useCallback(({ points }) => {
    const newPoints = userPoints + points;
    setUserPoints(newPoints);
    try {
      localStorage.setItem(storageKeys.cadetPoints, newPoints.toString());
    } catch {
      // Storage unavailable
    }

    const now = new Date();
    const today = getLocalDateString(now);
    const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    let newStreak = dailyStreak;
    if (lastDailyDate === yesterday) {
      newStreak += 1;
    } else if (lastDailyDate !== today) {
      newStreak = 1;
    }

    setDailyStreak(newStreak);
    setLastDailyDate(today);
    try {
      localStorage.setItem(storageKeys.dailyStreak, newStreak.toString());
      localStorage.setItem(storageKeys.lastDailyDate, today);
    } catch {
      // Storage unavailable
    }
  }, [dailyStreak, lastDailyDate, userPoints]);

  // Reset progress
  const resetProgress = useCallback(() => {
    setUserPoints(0);
    setUnlockedBadges([]);
    setCompletedQuizzes([]);
    setCompletedSims([]);
    setDailyStreak(0);
    setLastDailyDate('');
    try {
      localStorage.removeItem(storageKeys.cadetPoints);
      localStorage.removeItem(storageKeys.cadetBadges);
      localStorage.removeItem(storageKeys.completedQuizzes);
      localStorage.removeItem(storageKeys.completedSims);
      localStorage.removeItem(storageKeys.dailyStreak);
      localStorage.removeItem(storageKeys.lastDailyDate);
    } catch {
      // Storage unavailable
    }
  }, []);

  const todayStr = getLocalDateString();
  const hasCompletedDailyToday = lastDailyDate === todayStr;

  const value = useMemo(() => ({
    userPoints,
    unlockedBadges,
    completedQuizzes,
    completedSims,
    dailyStreak,
    lastDailyDate,
    hasCompletedDailyToday,
    awardQuizPoints,
    awardSimulationPoints,
    awardDailyPoints,
    resetProgress
  }), [
    userPoints,
    unlockedBadges,
    completedQuizzes,
    completedSims,
    dailyStreak,
    lastDailyDate,
    hasCompletedDailyToday,
    awardQuizPoints,
    awardSimulationPoints,
    awardDailyPoints,
    resetProgress
  ]);

  return (
    <CadetContext.Provider value={value}>
      {children}
    </CadetContext.Provider>
  );
}

export function useCadet() {
  const context = useContext(CadetContext);
  if (!context) {
    throw new Error('useCadet must be used within a CadetProvider');
  }
  return context;
}
