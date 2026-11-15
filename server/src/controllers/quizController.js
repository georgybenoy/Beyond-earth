import { seedStore } from '../data/seedStore.js';

export const getAllQuizzes = (req, res, next) => {
  try {
    const { difficulty } = req.query;
    let quizzes = seedStore.getRawQuizzes();

    if (difficulty) {
      const diffUpper = difficulty.toUpperCase();
      quizzes = quizzes.filter(q => q.difficulty.toUpperCase() === diffUpper);
    }

    const summary = quizzes.map(q => ({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      category: q.category,
      description: q.description,
      badge_points: q.badge_points,
      badge_name: q.badge_name,
      question_count: q.questions.length
    }));

    res.json({
      success: true,
      data: summary,
      meta: { total: summary.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const quiz = seedStore.getQuizBySlug(slug);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz '${slug}' not found`
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSimulations = (req, res, next) => {
  try {
    const simulations = seedStore.getRawSimulations();
    res.json({
      success: true,
      data: simulations,
      meta: { total: simulations.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getSimulationBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const sim = seedStore.getSimulationBySlug(slug);

    if (!sim) {
      return res.status(404).json({
        success: false,
        message: `Simulation '${slug}' not found`
      });
    }

    res.json({
      success: true,
      data: sim
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyChallenge = (req, res, next) => {
  try {
    const quizzes = seedStore.getRawQuizzes();
    // Flatten all questions
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

    // Deterministic daily index based on year, month, and day
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dailyIndex = dayOfYear % allQuestions.length;
    const question = allQuestions[dailyIndex];

    res.json({
      success: true,
      data: {
        date: now.toISOString().slice(0, 10),
        challenge_id: `daily-${now.toISOString().slice(0, 10)}`,
        badge_points: 50,
        question: question
      }
    });
  } catch (error) {
    next(error);
  }
};
