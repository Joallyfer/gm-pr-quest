import { useState, useEffect } from "react";
import { Shield, ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/question";
import { loadAllQuestions, getSimulationQuestions, calculateScore } from "@/lib/questionsLoader";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Simulation = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours in seconds
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (started && timeLeft > 0 && !finished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft, finished]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startSimulation = async () => {
    setLoading(true);
    try {
      const allQuestions = await loadAllQuestions();
      console.log(`Total de questões carregadas: ${allQuestions.length}`);
      
      const simQuestions = getSimulationQuestions(allQuestions);
      
      if (simQuestions.length < 30) {
        toast.error(`Não há questões suficientes. Encontradas: ${simQuestions.length}/40`);
        return;
      }
      
      if (simQuestions.length < 40) {
        toast.warning(`Simulado gerado com ${simQuestions.length} questões (ideal: 40)`);
      }
      
      setQuestions(simQuestions);
      setStarted(true);
      toast.success("Simulado iniciado! Boa sorte! 🍀");
    } catch (error) {
      toast.error("Erro ao carregar o simulado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    const scoreData = calculateScore(questions, answers);
    const timeSpent = 4 * 60 * 60 - timeLeft;
    
    setResult({
      ...scoreData,
      answeredCount: Object.keys(answers).length,
      totalQuestions: questions.length,
      timeSpent,
    });
    setFinished(true);
    
    toast.success(scoreData.passed ? "Parabéns! Você foi aprovado! 🎉" : "Continue estudando! Você consegue! 💪");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparando seu simulado...</p>
        </div>
      </div>
    );
  }

  if (finished && result) {
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
                <h1 className="text-xl font-bold text-foreground">Resultado do Simulado</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container max-w-4xl mx-auto px-4 py-8">
          <Card className={`p-8 mb-6 ${result.passed ? 'bg-success/5 border-success' : 'bg-destructive/5 border-destructive'} border-2`}>
            <div className="text-center">
              <div className="text-6xl font-bold mb-4" style={{ color: result.passed ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
                {result.total.toFixed(1)}
              </div>
              <div className="text-2xl font-semibold mb-2">
                {result.passed ? "✅ APROVADO" : "❌ REPROVADO"}
              </div>
              <p className="text-muted-foreground">
                Nota mínima para aprovação: 50 pontos
              </p>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card className="p-6">
              <h3 className="text-sm text-muted-foreground mb-2">Questões Respondidas</h3>
              <p className="text-2xl font-bold text-foreground">
                {result.answeredCount} / {result.totalQuestions}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-muted-foreground mb-2">Tempo Gasto</h3>
              <p className="text-2xl font-bold text-foreground">
                {formatTime(result.timeSpent)}
              </p>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Desempenho por Matéria</h3>
            <div className="space-y-4">
              {Object.entries(result.scoreBySubject).map(([subject, data]: [string, any]) => (
                <div key={subject}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.correct}/{data.total} • {data.score.toFixed(1)} pts
                    </span>
                  </div>
                  <Progress value={(data.correct / data.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
              Voltar ao Dashboard
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1 bg-gradient-primary">
              Fazer Novo Simulado
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!started) {
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
                <h1 className="text-xl font-bold text-foreground">Simulado AOCP</h1>
                <p className="text-xs text-muted-foreground">Formato Real de Prova</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 border-l-4 border-l-primary bg-primary/5 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Instruções do Simulado
            </h2>
            <div className="space-y-3 text-foreground">
              <p>• O simulado contém <strong>40 questões</strong> no formato da prova AOCP</p>
              <p>• Tempo máximo: <strong>4 horas</strong></p>
              <p>• Nota mínima para aprovação: <strong>50 pontos</strong></p>
              <p>• As questões têm pesos diferentes por matéria</p>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Composição do Simulado</h3>
            <div className="space-y-3">
              {[
                { materia: "Língua Portuguesa", questoes: 5, peso: 1.5 },
                { materia: "Raciocínio Lógico-Matemático", questoes: 5, peso: 1.5 },
                { materia: "Informática", questoes: 5, peso: 1.5 },
                { materia: "História e Geografia", questoes: 5, peso: 1.5 },
                { materia: "Noções de Direito", questoes: 10, peso: 3.5 },
                { materia: "Legislação Específica", questoes: 10, peso: 3.5 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.materia}</span>
                  <span className="text-muted-foreground">
                    {item.questoes} questões • Peso {item.peso}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-warning/10 border-warning/30 mb-8">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">⚠️ Plano Gratuito</h4>
                <p className="text-sm text-muted-foreground">
                  Você tem direito a <strong>1 simulado completo</strong> no plano gratuito. 
                  Faça upgrade para Premium e tenha acesso ilimitado.
                </p>
              </div>
            </div>
          </Card>

          <Button onClick={startSimulation} size="lg" className="w-full bg-gradient-primary">
            Iniciar Simulado
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Questão {currentQuestionIndex + 1} de {questions.length}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(answers).length} respondidas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <Progress value={(Object.keys(answers).length / questions.length) * 100} className="mt-3" />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <QuestionCard
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          showFeedback={false}
          selectedAnswerProp={answers[currentQuestionIndex] || null}
        />

        <div className="mt-6 flex justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Anterior
          </Button>
          <div className="flex gap-4">
            <Button onClick={handleFinish} variant="destructive">
              Finalizar Simulado
            </Button>
            {currentQuestionIndex < questions.length - 1 && (
              <Button onClick={handleNext} className="bg-gradient-primary">
                Próxima
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Simulation;
