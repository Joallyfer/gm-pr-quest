export interface QuestionOrigin {
  cidade: string;
  ano: number;
  banca: string;
}

export interface Question {
  origem?: QuestionOrigin;
  materia: string;
  numero: number;
  enunciado: string;
  alternativas: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  correta: string;
  explicacao: string;
}

export type Subject = 
  | "Português" 
  | "Língua Portuguesa"
  | "RLM"
  | "Raciocínio Lógico"
  | "Informática"
  | "História e Geografia"
  | "Noções de Direito"
  | "Direito"
  | "Legislação"
  | "Legislação Específica";

export interface QuestionAnswer {
  questionId: string;
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  subject: string;
  timestamp: string;
}

export interface SimulationResult {
  date: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  scoreBySubject: Record<string, { correct: number; total: number; score: number }>;
}

export interface UserProgress {
  questionsAnswered: QuestionAnswer[];
  simulationsCompleted: SimulationResult[];
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  isPremium: boolean;
}
