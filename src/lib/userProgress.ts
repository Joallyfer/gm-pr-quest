import { Question, SimulationResult, UserProgress } from "@/types/question";

const STORAGE_KEY = "gm_aocp_user_progress";

// Get user progress from localStorage
export const getUserProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    questionsAnswered: [],
    simulationsCompleted: [],
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    isPremium: false,
  };
};

// Save user progress to localStorage
const saveUserProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

// Record a question answer
export const recordQuestionAnswer = (
  question: Question,
  userAnswer: string,
  isCorrect: boolean,
  subject: string
) => {
  const progress = getUserProgress();
  
  // Check if question was already answered
  const existingIndex = progress.questionsAnswered.findIndex(
    q => q.questionId === `${question.origem?.cidade || 'unknown'}_${question.numero}`
  );
  
  const questionRecord = {
    questionId: `${question.origem?.cidade || 'unknown'}_${question.numero}`,
    question,
    userAnswer,
    isCorrect,
    subject,
    timestamp: new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    progress.questionsAnswered[existingIndex] = questionRecord;
  } else {
    progress.questionsAnswered.push(questionRecord);
    progress.totalQuestionsAnswered++;
    if (isCorrect) {
      progress.totalCorrectAnswers++;
    }
  }
  
  saveUserProgress(progress);
};

// Record a simulation result
export const recordSimulationResult = (result: SimulationResult) => {
  const progress = getUserProgress();
  progress.simulationsCompleted.push(result);
  saveUserProgress(progress);
};

// Get questions that user got wrong
export const getIncorrectQuestions = () => {
  const progress = getUserProgress();
  return progress.questionsAnswered.filter(q => !q.isCorrect);
};

// Get statistics by subject
export const getSubjectStatistics = () => {
  const progress = getUserProgress();
  const subjectStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  
  progress.questionsAnswered.forEach(q => {
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = { correct: 0, total: 0, percentage: 0 };
    }
    
    subjectStats[q.subject].total++;
    if (q.isCorrect) {
      subjectStats[q.subject].correct++;
    }
  });
  
  // Calculate percentages
  Object.keys(subjectStats).forEach(subject => {
    const stats = subjectStats[subject];
    stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });
  
  return subjectStats;
};

// Get latest simulation
export const getLatestSimulation = (): SimulationResult | null => {
  const progress = getUserProgress();
  if (progress.simulationsCompleted.length === 0) return null;
  return progress.simulationsCompleted[progress.simulationsCompleted.length - 1];
};

// Get average simulation score
export const getAverageSimulationScore = (): number => {
  const progress = getUserProgress();
  if (progress.simulationsCompleted.length === 0) return 0;
  
  const total = progress.simulationsCompleted.reduce((sum, sim) => sum + sim.score, 0);
  return Math.round(total / progress.simulationsCompleted.length);
};

// Get total study time (mock for now)
export const getTotalStudyTime = (): number => {
  const progress = getUserProgress();
  const totalTime = progress.simulationsCompleted.reduce((sum, sim) => sum + sim.timeSpent, 0);
  return totalTime;
};

// Check if user reached free plan limit
export const hasReachedFreeLimit = (): boolean => {
  const progress = getUserProgress();
  if (progress.isPremium) return false;
  return progress.totalQuestionsAnswered >= 30;
};

// Set premium status
export const setPremiumStatus = (isPremium: boolean) => {
  const progress = getUserProgress();
  progress.isPremium = isPremium;
  saveUserProgress(progress);
};

// Clear all progress (for testing)
export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};
