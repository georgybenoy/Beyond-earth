import { quizService } from '../services/quizService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllQuizzes = asyncHandler(async (req, res) => {
  const { difficulty } = req.query;
  const summary = quizService.getAllQuizzes(difficulty);
  res.json({
    success: true,
    data: summary,
    meta: { total: summary.length }
  });
});

export const getQuizBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const quiz = quizService.getQuizBySlug(slug);

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
});

export const getAllSimulations = asyncHandler(async (req, res) => {
  const simulations = quizService.getAllSimulations();
  res.json({
    success: true,
    data: simulations,
    meta: { total: simulations.length }
  });
});

export const getSimulationBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const sim = quizService.getSimulationBySlug(slug);

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
});

export const getDailyChallenge = asyncHandler(async (req, res) => {
  const daily = quizService.getDailyChallenge();
  res.json({
    success: true,
    data: daily
  });
});
