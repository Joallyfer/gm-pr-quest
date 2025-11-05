import { BookOpen, Target, TrendingUp, PenTool, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Modo Estudo",
      description: "Estude por matéria com feedback imediato e explicações detalhadas",
      color: "text-primary",
    },
    {
      icon: Target,
      title: "Simulado AOCP",
      description: "Pratique com simulados no formato real da prova com 40 questões",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Acompanhe seu Desempenho",
      description: "Veja sua evolução com gráficos e estatísticas detalhadas",
      color: "text-success",
    },
    {
      icon: PenTool,
      title: "Redação com IA",
      description: "Correção automática e feedback detalhado (Premium)",
      color: "text-warning",
    },
  ];

  const stats = [
    { value: "1000+", label: "Questões" },
    { value: "6", label: "Matérias" },
    { value: "8", label: "Cidades" },
    { value: "4h", label: "Simulado Real" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Simulado GM AOCP</h1>
              <p className="text-xs text-muted-foreground">Guarda Municipal do Paraná</p>
            </div>
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => navigate("/auth")}
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
              Prepare-se para o Concurso da Guarda Municipal
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Mais de 1000 questões reais de provas anteriores, simulados no formato AOCP e correção de redação com Inteligência Artificial
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={() => navigate("/auth")}
              >
                Começar Gratuitamente
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Tudo que você precisa para passar
            </h3>
            <p className="text-lg text-muted-foreground">
              Plataforma completa de estudos para a Guarda Municipal
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
                <feature.icon className={`mb-4 h-12 w-12 ${feature.color}`} />
                <h4 className="mb-2 text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Matérias Cobertas
            </h3>
            <p className="text-lg text-muted-foreground">
              Todas as disciplinas do edital em um só lugar
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Língua Portuguesa",
              "Raciocínio Lógico-Matemático",
              "Informática",
              "História e Geografia",
              "Noções de Direito",
              "Legislação Específica",
            ].map((subject, index) => (
              <Card key={index} className="border-l-4 border-l-primary bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-card-foreground">{subject}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-primary/20 bg-gradient-primary p-12 text-center shadow-glow">
            <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Comece sua preparação hoje
            </h3>
            <p className="mb-8 text-lg text-white/90">
              Acesso gratuito a 30 questões e 1 simulado completo
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              Criar Conta Grátis
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Simulado GM AOCP. Todos os direitos reservados.</p>
          <p className="mt-2">Plataforma de estudos para concursos da Guarda Municipal</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
