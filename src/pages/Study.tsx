import { useState, useEffect } from "react";
import { Shield, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/question";
import { loadAllQuestions, getQuestionsBySubject, getRandomQuestions } from "@/lib/questionsLoader";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";

const subjects = [
  "Português",
  "RLM",
  "Informática",
  "História e Geografia",
  "Noções de Direito",
  "Legislação",
];

const Study = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const FREE_LIMIT = 30;

  useEffect(() => {
    if (selectedSubject) {
      loadSubjectQuestions(selectedSubject);
    }
  }, [selectedSubject]);

  const loadSubjectQuestions = async (subject: string) => {
    setLoading(true);
    try {
      const allQuestions = await loadAllQuestions();
      const subjectQuestions = getQuestionsBySubject(allQuestions, subject);
      const randomQuestions = getRandomQuestions(subjectQuestions, 20);
      setQuestions(randomQuestions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      toast.error("Erro ao carregar questões");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[currentQuestionIndex].correta;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    
    setAnsweredCount(prev => prev + 1);

    // Check free limit
    if (answeredCount + 1 >= FREE_LIMIT) {
      toast.warning("Você atingiu o limite de questões gratuitas!", {
        description: "Faça upgrade para o plano Premium e continue estudando.",
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      toast.success("Você completou todas as questões desta sessão!");
      setSelectedSubject(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Modo Estudo</h1>
                <p className="text-xs text-muted-foreground">Escolha uma matéria para estudar</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="mb-6 p-6 border-l-4 border-l-primary bg-primary/5">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Como funciona o Modo Estudo</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione uma matéria abaixo e responda as questões. Você receberá feedback imediato 
                  com a explicação detalhada após cada resposta.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card
                key={subject}
                className="p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{subject}</h3>
                    <p className="text-xs text-muted-foreground">Clique para estudar</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              💡 <strong>Plano Gratuito:</strong> Você tem acesso a até {FREE_LIMIT} questões. 
              Questões respondidas: <strong>{answeredCount}/{FREE_LIMIT}</strong>
            </p>
          </Card>
        </main>
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSubject(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-foreground">{selectedSubject}</h1>
                <p className="text-xs text-muted-foreground">
                  {correctCount} acertos de {answeredCount} respondidas
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                Questões restantes: {FREE_LIMIT - answeredCount}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <QuestionCard
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          showFeedback={true}
          selectedAnswerProp={null}
        />

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} className="bg-gradient-primary">
            {currentQuestionIndex < questions.length - 1 ? "Próxima Questão" : "Finalizar"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Study;
