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

export interface SimulationResult {
  id: string;
  userId: string;
  date: Date;
  questions: Question[];
  answers: Record<number, string>;
  score: number;
  timeSpent: number;
  passed: boolean;
  scoreBySubject: Record<string, { correct: number; total: number; score: number }>;
}

export interface UserProgress {
  questionsAnswered: number;
  simulationsCompleted: number;
  lastScore: number;
  averageScore: number;
  wrongQuestions: Question[];
}
