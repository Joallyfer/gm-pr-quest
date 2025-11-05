import { supabase } from "@/integrations/supabase/client";
import { Question, SimulationResult } from "@/types/question";

// Get user progress from Supabase
export const getUserProgress = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileData, questionsData, simulationsData] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("question_answers").select("*").eq("user_id", user.id),
    supabase.from("simulations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const totalCorrect = questionsData.data?.filter(q => q.is_correct).length || 0;

  return {
    profile: profileData.data,
    questionsAnswered: questionsData.data || [],
    simulationsCompleted: simulationsData.data || [],
    totalQuestionsAnswered: questionsData.data?.length || 0,
    totalCorrectAnswers: totalCorrect,
    isPremium: profileData.data?.is_premium || false,
  };
};

// Record a question answer
export const recordQuestionAnswer = async (
  question: Question,
  userAnswer: string,
  isCorrect: boolean,
  subject: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const questionId = `${question.origem?.cidade || 'unknown'}_${question.numero}`;

  // Check if question was already answered
  const { data: existing } = await supabase
    .from("question_answers")
    .select("id")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .single();

  if (existing) {
    // Update existing answer
    await supabase
      .from("question_answers")
      .update({
        user_answer: userAnswer,
        is_correct: isCorrect,
        question_data: question as any,
        subject,
      })
      .eq("id", existing.id);
  } else {
    // Insert new answer
    await supabase.from("question_answers").insert({
      user_id: user.id,
      question_id: questionId,
      question_data: question as any,
      user_answer: userAnswer,
      is_correct: isCorrect,
      subject,
    });
  }
};

// Record a simulation result
export const recordSimulationResult = async (result: SimulationResult) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  await supabase.from("simulations").insert({
    user_id: user.id,
    score: result.score,
    passed: result.passed,
    time_spent: result.timeSpent,
    score_by_subject: result.scoreBySubject,
  });
};

// Get questions that user got wrong
export const getIncorrectQuestions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("question_answers")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_correct", false);

  return data?.map(q => ({
    questionId: q.question_id,
    question: q.question_data as unknown as Question,
    userAnswer: q.user_answer,
    isCorrect: q.is_correct,
    subject: q.subject,
    timestamp: q.created_at,
  })) || [];
};

// Get statistics by subject
export const getSubjectStatistics = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("question_answers")
    .select("subject, is_correct")
    .eq("user_id", user.id);

  if (!data) return {};

  const subjectStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  
  data.forEach(q => {
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = { correct: 0, total: 0, percentage: 0 };
    }
    
    subjectStats[q.subject].total++;
    if (q.is_correct) {
      subjectStats[q.subject].correct++;
    }
  });
  
  Object.keys(subjectStats).forEach(subject => {
    const stats = subjectStats[subject];
    stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });
  
  return subjectStats;
};

// Get latest simulation
export const getLatestSimulation = async (): Promise<SimulationResult | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("simulations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  return {
    date: data.created_at,
    score: data.score,
    passed: data.passed,
    timeSpent: data.time_spent,
    scoreBySubject: data.score_by_subject as Record<string, { correct: number; total: number; score: number }>,
  };
};

// Get average simulation score
export const getAverageSimulationScore = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("simulations")
    .select("score")
    .eq("user_id", user.id);

  if (!data || data.length === 0) return 0;
  
  const total = data.reduce((sum, sim) => sum + sim.score, 0);
  return Math.round(total / data.length);
};

// Get total study time
export const getTotalStudyTime = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("simulations")
    .select("time_spent")
    .eq("user_id", user.id);

  if (!data) return 0;
  
  return data.reduce((sum, sim) => sum + sim.time_spent, 0);
};

// Check if user reached free plan limit
export const hasReachedFreeLimit = async (): Promise<boolean> => {
  const progress = await getUserProgress();
  if (!progress) return false;
  if (progress.isPremium) return false;
  return progress.totalQuestionsAnswered >= 30;
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get user profile
export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
};
