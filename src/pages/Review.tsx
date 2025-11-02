import { useState, useEffect } from "react";
import { Shield, ArrowLeft, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getIncorrectQuestions, recordQuestionAnswer } from "@/lib/userProgress";
import { QuestionCard } from "@/components/QuestionCard";

const Review = () => {
  const navigate = useNavigate();
  const [wrongQuestions, setWrongQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const incorrect = getIncorrectQuestions();
    setWrongQuestions(incorrect);
  }, []);

  const handleAnswer = (answer: string) => {
    const currentQuestion = wrongQuestions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.question.correta;
    
    // Record the new answer
    recordQuestionAnswer(
      currentQuestion.question,
      answer,
      isCorrect,
      currentQuestion.subject
    );
    
    // If correct, refresh the list (question will be removed)
    if (isCorrect) {
      const updated = getIncorrectQuestions();
      setWrongQuestions(updated);
      
      // Adjust index if needed
      if (currentQuestionIndex >= updated.length && updated.length > 0) {
        setCurrentQuestionIndex(updated.length - 1);
      } else if (updated.length === 0) {
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < wrongQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

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
              <h1 className="text-xl font-bold text-foreground">Revisão</h1>
              <p className="text-xs text-muted-foreground">Questões que você errou</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 border-l-4 border-l-primary bg-primary/5 mb-8">
          <div className="flex items-start gap-3">
            <RotateCcw className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-foreground">
                Como funciona a Revisão
              </h2>
              <p className="text-muted-foreground mb-4">
                Esta seção mostra todas as questões que você errou durante seus estudos. 
                Revise-as para fixar o conteúdo e melhorar seu desempenho.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• As questões são organizadas por matéria</li>
                <li>• Você pode refazer cada questão quantas vezes quiser</li>
                <li>• Ao acertar uma questão, ela sai da lista de revisão</li>
                <li>• Revise as explicações com atenção</li>
              </ul>
            </div>
          </div>
        </Card>

        {wrongQuestions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <RotateCcw className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Nenhuma questão para revisar
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não errou nenhuma questão ou já revisou todas!
                </p>
                <Button onClick={() => navigate("/study")} className="bg-gradient-primary">
                  Começar a Estudar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 bg-warning/10 border-warning/30">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">📚 Dica de Estudo</h4>
                  <p className="text-sm text-muted-foreground">
                    Concentre-se em entender o <strong>porquê</strong> da resposta correta, 
                    não apenas em memorizá-la. Leia a explicação com atenção!
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-4">
              <p className="text-sm text-muted-foreground mb-4">
                Questão {currentQuestionIndex + 1} de {wrongQuestions.length} • Resposta anterior: {wrongQuestions[currentQuestionIndex].userAnswer}
              </p>
            </Card>

            <QuestionCard
              question={wrongQuestions[currentQuestionIndex].question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={wrongQuestions.length}
              onAnswer={handleAnswer}
              showFeedback={true}
              selectedAnswerProp={null}
            />

            <div className="mt-6 flex justify-between gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex >= wrongQuestions.length - 1}
                className="bg-gradient-primary"
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Review;
