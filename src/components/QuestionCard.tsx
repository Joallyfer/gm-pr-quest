import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CASCAVEL_READING_TEXT = `PORTUGUÊS
Pesquisadores podem ter identificado fóssil de menor dinossauro já visto
Cientistas descreveram na revista Nature o fóssil do menor dinossauro já visto. A evidência foi encontrada dentro de um âmbar (resina de árvores fossilizadas) proveniente do norte de Myanmar. O dinossauro – que se assemelha aos menores pássaros existentes hoje – viveu há cerca de 99 milhões de anos, no período Cretáceo.
O fóssil era um crânio de 1,5 centímetros de comprimento, tamanho aproximado de uma unha de polegar. Com base nisso, pesquisadores acreditam que o dinossauro, batizado de Oculudentavis khaungraae, tinha o tamanho de um colibri-abelha-cubano – espécie de beija-flor que pesa, no máximo, dois gramas.
Pode ser que o Oculudentavis tenha relação com outras espécies de dinossauros com penas, como o Archaeopteryx e o Jeholornis (primos distantes dos pássaros modernos). Mas é difícil fazer qualquer afirmação sem evidências do resto de seu corpo. A única certeza é que o fóssil pertence a um dinossauro que morreu na idade adulta. Para concluir isso, cientistas fizeram um exame que indica a maturação do dinossauro, analisando o quanto seus ossos se fundiram.
O formato do crânio sugere que o dinossauro era um grande caçador de insetos que exercia suas atividades durante o dia. Apesar da cabeça pequena, guardava 40 dentes na mandíbula superior. Além disso, seus olhos enormes eram sustentados por ossos côncavos, parecidos com os de alguns lagartos, e com uma abertura estreita que restringia a entrada abundante de luz, facilitando a busca por alimentos sob o sol.
São essas características que podem ________ de outras aves e ________ para a família dos dinossauros. Os pesquisadores acreditam que elas surgiram devido à falta de recursos existentes nas ilhas em que viviam, o que causou uma miniaturização evolucionária, ou seja, os Oculudentavis foram ficando pequenininos.
O âmbar com o fóssil havia sido adquirido em 2016 por um colecionador. Ele notou o fóssil presente e doou a relíquia para o Hupoge Amber Museum, em Tengchong (China). Nas florestas tropicais de Myanmar, paleontologistas já identificaram âmbares contendo insetos, cobras e até pedaços de dinossauros com penas. Nas árvores fossilizadas da região, é possível encontrar os menores habitantes que passaram por lá.`;

const COLOMBO_READING_TEXT_1_3 = `O nome Krenak é constituído por dois termos: um é a primeira partícula, kre, que significa cabeça, a outra, nak, significa terra. Krenak é a herança que recebemos dos nossos antepassados, das nossas memórias de origem, que nos identifica como "cabeça da terra", como uma humanidade que não consegue se conceber sem essa conexão, sem essa profunda comunhão com a terra. Não a terra como um sítio, mas como esse lugar que todos compartilhamos, e do qual nós, os Krenak, nos sentimos cada vez mais desraigados – desse lugar que para nós sempre foi sagrado, mas que percebemos que nossos vizinhos têm quase vergonha de admitir que pode ser visto assim. Quando nós falamos que o nosso rio é sagrado, as pessoas dizem: "Isso é algum folclore deles"; quando dizemos que a montanha está mostrando que vai chover e que esse dia vai ser um dia próspero, um dia bom, eles dizem: "Não, uma montanha não fala nada". Quando despersonalizamos o rio, a montanha, quando tiramos deles os seus sentidos, considerando que isso é atributo exclusivo dos humanos, nós liberamos esses lugares para que se tornem resíduos da atividade industrial e extrativista. Do nosso divórcio das integrações e interações com a nossa mãe, a Terra, resulta que ela está nos deixando órfãos, não só aos que em diferente graduação são chamados de índios, indígenas ou povos indígenas, mas a todos.`;

const COLOMBO_READING_TEXT_4_6 = `O que é lugar de fala?
Numa sociedade como a brasileira, de herança escravocrata, pessoas negras vão experenciar racismo do lugar de quem é objeto dessa opressão, do lugar que restringe oportunidades por conta desse sistema de opressão. Pessoas brancas vão experenciar do lugar de quem se beneficia dessa mesma opressão. Logo, ambos os grupos podem e devem discutir essas questões, mas falarão de lugares distintos. Estamos dizendo, principalmente, que queremos e reivindicamos que a história sobre a escravidão no Brasil seja contada por nossas perspectivas também e não somente pela perspectiva de quem venceu, para parafrasear Walter Benjamin, em Teses sobre o conceito de história. Estamos apontando para a importância de quebra de um sistema vigente que invisibiliza essas narrativas.`;

const COLOMBO_READING_TEXT_7_8 = `Pajem do sinhô-moço, escravo do sinhô-moço, tudo do sinhô-moço, nada do sinhô-moço. Um dia o coronelzinho, que já sabia ler, ficou curioso para ver se negro aprendia os sinais, as letras de branco e começou a ensinar o pai de Ponciá. O menino respondeu logo ao ensinamento do distraído mestre. Em pouco tempo reconhecia todas as letras. Quando sinhô-moço se certificou que o negro aprendia, parou a brincadeira. Negro aprendia sim! Mas o que o negro ia fazer com o saber de branco? O pai de Ponciá Vicêncio, em matéria de livros e letras, nunca foi além daquele saber.`;

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
  selectedAnswerProp?: string | null;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showFeedback = false,
  selectedAnswerProp,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(selectedAnswerProp || null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(selectedAnswerProp || null);
    setShowExplanation(false);
  }, [question.numero, questionNumber, selectedAnswerProp]);

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

  // Check if question is Portuguese from Cascavel or Colombo
  const isPortugueseCascavel = 
    question.origem?.cidade === "Cascavel" && 
    (question.materia === "Língua Portuguesa" || question.materia === "Português");

  const isPortugueseCombo = 
    question.origem?.cidade === "Colombo" && 
    (question.materia === "Língua Portuguesa" || question.materia === "Português");

  // Get reading text for Colombo based on question number
  const getColomboReadingText = () => {
    if (!isPortugueseCombo) return null;
    const num = question.numero;
    if (num >= 1 && num <= 3) return COLOMBO_READING_TEXT_1_3;
    if (num >= 4 && num <= 6) return COLOMBO_READING_TEXT_4_6;
    if (num >= 7 && num <= 8) return COLOMBO_READING_TEXT_7_8;
    return null;
  };

  const readingText = isPortugueseCascavel 
    ? CASCAVEL_READING_TEXT 
    : getColomboReadingText();

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

      {/* Reading Text for Portuguese Questions */}
      {readingText && (
        <Card className="mb-6 p-4 bg-muted/50 border-l-4 border-l-primary">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Texto para leitura:</h3>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {readingText}
          </div>
        </Card>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-foreground leading-relaxed font-semibold">{question.enunciado}</p>
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
