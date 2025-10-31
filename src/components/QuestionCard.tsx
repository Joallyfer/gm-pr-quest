import { useState } from "react";
import { Question } from "@/types/question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showFeedback = false,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback && selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    if (showFeedback) {
      setShowExplanation(true);
    }
    
    onAnswer(answer);
  };

  const isCorrect = selectedAnswer === question.correta;
  const alternatives = ["a", "b", "c", "d", "e"].filter(
    (key) => question.alternativas[key as keyof typeof question.alternativas]
  );

  return (
    <Card className="p-6 border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <span className="text-sm font-medium text-primary">
            Questão {questionNumber} de {totalQuestions}
          </span>
          <p className="text-xs text-muted-foreground mt-1">{question.materia}</p>
          {question.origem && (
            <p className="text-xs text-muted-foreground">
              {question.origem.cidade} • {question.origem.ano} • {question.origem.banca}
            </p>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-foreground leading-relaxed">{question.enunciado}</p>
      </div>

      {/* Alternatives */}
      <div className="space-y-3 mb-6">
        {alternatives.map((key) => {
          const isSelected = selectedAnswer === key;
          const isCorrectAnswer = key === question.correta;
          const showCorrect = showFeedback && showExplanation && isCorrectAnswer;
          const showWrong = showFeedback && showExplanation && isSelected && !isCorrect;

          return (
            <button
              key={key}
              onClick={() => handleAnswerSelect(key)}
              disabled={showFeedback && showExplanation}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-primary/50 disabled:cursor-default",
                isSelected && !showExplanation && "border-primary bg-primary/5",
                showCorrect && "border-success bg-success/10",
                showWrong && "border-destructive bg-destructive/10",
                !isSelected && !showCorrect && !showWrong && "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                    isSelected && !showExplanation && "bg-primary text-primary-foreground",
                    showCorrect && "bg-success text-success-foreground",
                    showWrong && "bg-destructive text-destructive-foreground",
                    !isSelected && !showCorrect && !showWrong && "bg-muted text-muted-foreground"
                  )}
                >
                  {key.toUpperCase()}
                </span>
                <span className="flex-1 text-sm text-foreground pt-1">
                  {question.alternativas[key as keyof typeof question.alternativas]}
                </span>
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-1" />}
                {showWrong && <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && showExplanation && (
        <Card
          className={cn(
            "p-4 border-l-4",
            isCorrect
              ? "bg-success/5 border-l-success"
              : "bg-destructive/5 border-l-destructive"
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2">
                {isCorrect ? "Resposta Correta! 🎉" : "Resposta Incorreta"}
              </h4>
              {!isCorrect && (
                <p className="text-sm text-muted-foreground mb-2">
                  A resposta correta é: <strong>{question.correta.toUpperCase()}</strong>
                </p>
              )}
              <p className="text-sm text-foreground">{question.explicacao}</p>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}
