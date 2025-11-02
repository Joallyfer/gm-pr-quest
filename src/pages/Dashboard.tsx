import { useState } from "react";
import { Shield, BookOpen, Target, TrendingUp, PenTool, RotateCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getUserProgress, getLatestSimulation, getAverageSimulationScore } from "@/lib/userProgress";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState("Usuário"); // Will be replaced with real auth

  const progress = getUserProgress();
  const latestSim = getLatestSimulation();
  const avgScore = getAverageSimulationScore();

  const stats = [
    {
      label: "Questões Respondidas",
      value: progress.totalQuestionsAnswered.toString(),
      total: progress.isPremium ? "∞" : "30",
      color: "text-primary",
    },
    {
      label: "Simulados Realizados",
      value: progress.simulationsCompleted.length.toString(),
      total: progress.isPremium ? "∞" : "1",
      color: "text-accent",
    },
    {
      label: "Última Nota",
      value: latestSim ? latestSim.score.toString() : "-",
      total: "100",
      color: "text-success",
    },
    {
      label: "Média Geral",
      value: avgScore > 0 ? avgScore.toString() : "-",
      total: "100",
      color: "text-warning",
    },
  ];

  const modules = [
    {
      icon: BookOpen,
      title: "Modo Estudo",
      description: "Estude por matéria com feedback imediato",
      color: "bg-primary/10 text-primary",
      borderColor: "border-primary/20",
      path: "/study",
    },
    {
      icon: Target,
      title: "Simulado AOCP",
      description: "40 questões no formato real da prova",
      color: "bg-accent/10 text-accent",
      borderColor: "border-accent/20",
      path: "/simulation",
    },
    {
      icon: RotateCcw,
      title: "Revisão",
      description: "Revise questões que você errou",
      color: "bg-success/10 text-success",
      borderColor: "border-success/20",
      path: "/review",
    },
    {
      icon: TrendingUp,
      title: "Meu Desempenho",
      description: "Veja sua evolução e estatísticas",
      color: "bg-warning/10 text-warning",
      borderColor: "border-warning/20",
      path: "/performance",
    },
    {
      icon: PenTool,
      title: "Redação com IA",
      description: "Correção automática (Premium)",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      path: "/essay",
      premium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Simulado GM AOCP</h1>
                <p className="text-xs text-muted-foreground">Guarda Municipal do Paraná</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">Plano Gratuito</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {userName}!
          </h2>
          <p className="text-muted-foreground">
            Continue sua preparação para o concurso da Guarda Municipal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-border">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upgrade Banner (for free users) */}
        <Card className="mb-8 bg-gradient-primary p-6 border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2">
                Desbloqueie todo o potencial da plataforma
              </h3>
              <p className="text-white/90">
                Acesso ilimitado a questões, simulados e correção de redação com IA
              </p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90 shrink-0">
              Assinar Premium
            </Button>
          </div>
        </Card>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Card
              key={index}
              className={`p-6 border-2 ${module.borderColor} hover:shadow-lg transition-all cursor-pointer group`}
              onClick={() => navigate(module.path)}
            >
              <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="h-6 w-6" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {module.title}
                </h3>
                {module.premium && (
                  <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <Card className="mt-8 p-6 border-l-4 border-l-primary bg-primary/5">
          <h3 className="font-semibold text-foreground mb-2">💡 Dica de Estudo</h3>
          <p className="text-sm text-muted-foreground">
            Comece pelo Modo Estudo para se familiarizar com as questões antes de fazer um simulado completo. 
            Revise sempre as explicações das questões que errar!
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
