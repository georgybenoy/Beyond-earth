import { seedStore } from '../data/seedStore.js';

export const quizService = {
  /**
   * Get all quiz summaries without leaking questions
   * @param {string} [difficulty] - Optional difficulty tier
   * @returns {Array<Object>} List of quiz summaries
   */
  getAllQuizzes: (difficulty) => {
    let quizzes = seedStore.getRawQuizzes();

    if (difficulty) {
      const diffUpper = difficulty.toUpperCase();
      quizzes = quizzes.filter(q => q.difficulty.toUpperCase() === diffUpper);
    }

    return quizzes.map(q => ({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      category: q.category,
      description: q.description,
      badge_points: q.badge_points,
      badge_name: q.badge_name,
      question_count: q.questions.length
    }));
  },

  /**
   * Get quiz by slug with complete questions
   * @param {string} slug - Quiz slug
   * @returns {Object|null} Full quiz or null
   */
  getQuizBySlug: (slug) => {
    return seedStore.getQuizBySlug(slug);
  },

  /**
   * Get all mission simulations
   * @returns {Array<Object>} Simulations array
   */
  getAllSimulations: () => {
    return seedStore.getRawSimulations();
  },

  /**
   * Get simulation by slug
   * @param {string} slug - Simulation slug
   * @returns {Object|null} Simulation or null
   */
  getSimulationBySlug: (slug) => {
    return seedStore.getSimulationBySlug(slug);
  },

  /**
   * Generate deterministic daily challenge question
   * @returns {Object} Daily challenge payload
   */
  getDailyChallenge: () => {
    const quizzes = seedStore.getRawQuizzes();
    const allQuestions = [];

    quizzes.forEach(q => {
      q.questions.forEach(quest => {
        allQuestions.push({
          ...quest,
          quiz_title: q.title,
          quiz_slug: q.slug,
          difficulty: q.difficulty
        });
      });
    });

    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dailyIndex = dayOfYear % allQuestions.length;
    const question = allQuestions[dailyIndex];

    return {
      date: now.toISOString().slice(0, 10),
      challenge_id: `daily-${now.toISOString().slice(0, 10)}`,
      badge_points: 50,
      question: question
    };
  }
};
