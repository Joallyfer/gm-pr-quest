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
  
  // Português / Língua Portuguesa
  if (normalized.includes("portugu") || normalized.includes("língua")) {
    return "Português";
  }
  
  // RLM / Raciocínio Lógico
  if (normalized.includes("lógic") || normalized.includes("raciocínio") || normalized.includes("matemát")) {
    return "RLM";
  }
  
  // Informática
  if (normalized.includes("informát")) {
    return "Informática";
  }
  
  // História e Geografia
  if (normalized.includes("história") || normalized.includes("geografia")) {
    return "História e Geografia";
  }
  
  // Direito
  if (normalized.includes("direito")) {
    return "Noções de Direito";
  }
  
  // Legislação
  if (normalized.includes("legisla")) {
    return "Legislação";
  }
  
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
  // First, normalize all questions
  const normalizedQuestions = questions.map(q => ({
    ...q,
    materia: normalizeSubject(q.materia)
  }));

  const subjects = [
    { name: "Português", count: 5 },
    { name: "RLM", count: 5 },
    { name: "Informática", count: 5 },
    { name: "História e Geografia", count: 5 },
    { name: "Noções de Direito", count: 10 },
    { name: "Legislação", count: 10 },
  ];

  const simulationQuestions: Question[] = [];
  let missingQuestions = 0;

  for (const subject of subjects) {
    const subjectQuestions = normalizedQuestions.filter(q => q.materia === subject.name);
    console.log(`${subject.name}: ${subjectQuestions.length} questões disponíveis, precisa de ${subject.count}`);
    
    if (subjectQuestions.length < subject.count) {
      missingQuestions += subject.count - subjectQuestions.length;
      // Add all available questions
      simulationQuestions.push(...subjectQuestions);
    } else {
      const selected = getRandomQuestions(subjectQuestions, subject.count);
      simulationQuestions.push(...selected);
    }
  }

  console.log(`Total de questões no simulado: ${simulationQuestions.length}/40`);
  console.log(`Questões faltando: ${missingQuestions}`);

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
