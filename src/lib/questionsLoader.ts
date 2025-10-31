import { Question } from "@/types/question";

const JSON_FILES = [
  "/data/questoes_gm_araucaria_2025.json",
  "/data/questoes_gm_pr_compilado.json",
  "/data/simulado_gm_cascavel_2021.json",
  "/data/simulado_gm_colombo_2022.json",
  "/data/simulado_gm_foz_2024.json",
  "/data/simulado_gm_lapa_2025.json",
  "/data/simulado_gm_pitangueiras_2023.json",
  "/data/simulado_gm_ponta_grossa_2022.json",
];

let cachedQuestions: Question[] | null = null;

export async function loadAllQuestions(): Promise<Question[]> {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  const allQuestions: Question[] = [];

  for (const file of JSON_FILES) {
    try {
      const response = await fetch(file);
      const data = await response.json();
      allQuestions.push(...data);
    } catch (error) {
      console.error(`Erro ao carregar ${file}:`, error);
    }
  }

  cachedQuestions = allQuestions;
  return allQuestions;
}

export function normalizeSubject(subject: string): string {
  if (!subject) return "Outros";
  
  const normalized = subject.toLowerCase().trim();
  
  if (normalized.includes("portugu")) return "Português";
  if (normalized.includes("lógic") || normalized.includes("rlm")) return "RLM";
  if (normalized.includes("informát")) return "Informática";
  if (normalized.includes("história") || normalized.includes("geografia")) return "História e Geografia";
  if (normalized.includes("direito")) return "Noções de Direito";
  if (normalized.includes("legisla")) return "Legislação";
  
  return subject;
}

export function getQuestionsBySubject(questions: Question[], subject: string): Question[] {
  return questions.filter(q => normalizeSubject(q.materia) === subject);
}

export function getRandomQuestions(questions: Question[], count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getSimulationQuestions(questions: Question[]): Question[] {
  const subjects = [
    { name: "Português", count: 5 },
    { name: "RLM", count: 5 },
    { name: "Informática", count: 5 },
    { name: "História e Geografia", count: 5 },
    { name: "Noções de Direito", count: 10 },
    { name: "Legislação", count: 10 },
  ];

  const simulationQuestions: Question[] = [];

  for (const subject of subjects) {
    const subjectQuestions = getQuestionsBySubject(questions, subject.name);
    const selected = getRandomQuestions(subjectQuestions, subject.count);
    simulationQuestions.push(...selected);
  }

  return simulationQuestions;
}

export function calculateScore(
  questions: Question[],
  answers: Record<number, string>
): {
  total: number;
  scoreBySubject: Record<string, { correct: number; total: number; score: number }>;
  passed: boolean;
} {
  const weights: Record<string, number> = {
    "Português": 1.5,
    "RLM": 1.5,
    "Informática": 1.5,
    "História e Geografia": 1.5,
    "Noções de Direito": 3.5,
    "Legislação": 3.5,
  };

  const scoreBySubject: Record<string, { correct: number; total: number; score: number }> = {};
  let totalScore = 0;

  questions.forEach((question, index) => {
    const subject = normalizeSubject(question.materia);
    const weight = weights[subject] || 1;

    if (!scoreBySubject[subject]) {
      scoreBySubject[subject] = { correct: 0, total: 0, score: 0 };
    }

    scoreBySubject[subject].total++;

    if (answers[index] === question.correta) {
      scoreBySubject[subject].correct++;
      scoreBySubject[subject].score += weight;
      totalScore += weight;
    }
  });

  return {
    total: totalScore,
    scoreBySubject,
    passed: totalScore >= 50,
  };
}
