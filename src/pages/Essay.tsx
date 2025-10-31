import { useState } from "react";
import { Shield, ArrowLeft, PenTool, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const themes = [
  "O papel da Guarda Municipal na segurança pública moderna",
  "Cidadania e ética no serviço público",
  "A importância da tecnologia na prevenção da violência urbana",
  "Desafios da mobilidade e segurança nas grandes cidades",
  "O impacto da desinformação na atuação dos agentes públicos",
  "Respeito à diversidade e direitos humanos no serviço de segurança",
];

const Essay = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [essayText, setEssayText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isPremium = false; // Will be replaced with real user data

  const handleSubmit = async () => {
    if (!isPremium) {
      toast.error("Recurso exclusivo para assinantes Premium");
      return;
    }

    if (!selectedTheme) {
      toast.error("Selecione um tema primeiro");
      return;
    }

    if (essayText.length < 500) {
      toast.error("Sua redação deve ter no mínimo 500 caracteres");
      return;
    }

    setSubmitting(true);
    // API call to AI correction will be implemented
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Redação enviada para correção!");
    }, 2000);
  };

  const lineCount = essayText.split('\n').length;
  const charCount = essayText.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Redação com IA</h1>
                <p className="text-xs text-muted-foreground">Correção automática e feedback</p>
              </div>
            </div>
            {isPremium && (
              <div className="flex items-center gap-2 text-warning">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {!isPremium && (
          <Card className="p-8 bg-gradient-primary text-white mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Recurso Exclusivo Premium
                </h3>
                <p className="text-white/90 mb-4">
                  Correção automática de redações com Inteligência Artificial, nota de 0 a 100 
                  e feedback detalhado sobre gramática, coesão e argumentação.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  Fazer Upgrade Agora
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 border-l-4 border-l-primary bg-primary/5 mb-8">
          <div className="flex items-start gap-3">
            <PenTool className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-foreground">
                Como funciona
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Escolha um dos temas propostos</li>
                <li>• Escreva sua redação com no mínimo 20 linhas</li>
                <li>• A IA avaliará gramática, coesão, coerência e argumentação</li>
                <li>• Você receberá uma nota de 0 a 100 e feedback detalhado</li>
                <li>• Use o feedback para melhorar sua próxima redação</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Theme Selection */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Escolha um Tema
          </h3>
          <div className="space-y-3">
            {themes.map((theme, index) => (
              <button
                key={index}
                onClick={() => setSelectedTheme(theme)}
                disabled={!isPremium}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === theme
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${!isPremium ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground pt-1">{theme}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Essay Writing Area */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Sua Redação</h3>
            <div className="text-sm text-muted-foreground">
              {lineCount} linhas • {charCount} caracteres
            </div>
          </div>
          <Textarea
            placeholder={
              selectedTheme
                ? "Escreva sua redação aqui... (mínimo de 20 linhas)"
                : "Selecione um tema primeiro"
            }
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            disabled={!isPremium || !selectedTheme}
            className="min-h-[400px] font-mono text-sm leading-relaxed"
          />
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setSelectedTheme(null);
              setEssayText("");
            }}
            variant="outline"
            className="flex-1"
            disabled={!isPremium}
          >
            Limpar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isPremium || !selectedTheme || essayText.length < 500 || submitting}
            className="flex-1 bg-gradient-primary"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Enviar para Correção
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Essay;
