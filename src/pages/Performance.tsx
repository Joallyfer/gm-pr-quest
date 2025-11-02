import { Shield, ArrowLeft, TrendingUp, Trophy, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { getUserProgress, getSubjectStatistics, getTotalStudyTime } from "@/lib/userProgress";

const Performance = () => {
  const navigate = useNavigate();

  const progress = getUserProgress();
  const subjectStats = getSubjectStatistics();
  const studyTime = getTotalStudyTime();

  const stats = {
    totalQuestions: progress.totalQuestionsAnswered,
    correctAnswers: progress.totalCorrectAnswers,
    simulationsCompleted: progress.simulationsCompleted.length,
    averageScore: progress.simulationsCompleted.length > 0
      ? Math.round(progress.simulationsCompleted.reduce((sum, sim) => sum + sim.score, 0) / progress.simulationsCompleted.length)
      : 0,
    studyTime,
  };

  // Create array for all subjects with stats
  const allSubjects = ["Português", "RLM", "Informática", "História e Geografia", "Noções de Direito", "Legislação"];
  const subjectPerformance = allSubjects.map(subject => ({
    subject,
    correct: subjectStats[subject]?.correct || 0,
    total: subjectStats[subject]?.total || 0,
    percentage: subjectStats[subject]?.percentage || 0,
  }));

  const simulationHistory = progress.simulationsCompleted;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
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
              <h1 className="text-xl font-bold text-foreground">Meu Desempenho</h1>
              <p className="text-xs text-muted-foreground">Acompanhe sua evolução</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Questões Respondidas</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalQuestions}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Taxa de Acerto</p>
                <p className="text-3xl font-bold text-success">
                  {stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Simulados Realizados</p>
                <p className="text-3xl font-bold text-accent">{stats.simulationsCompleted}</p>
              </div>
              <Trophy className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo de Estudo</p>
                <p className="text-3xl font-bold text-warning">{formatTime(stats.studyTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Desempenho por Matéria</h3>
          {subjectPerformance.every(s => s.total === 0) ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Você ainda não respondeu questões suficientes
              </p>
              <Button onClick={() => navigate("/study")} className="bg-gradient-primary">
                Começar a Estudar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {subjectPerformance.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.correct}/{subject.total} • {subject.percentage}%
                    </span>
                  </div>
                  <Progress value={subject.percentage} className="h-3" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Simulation History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Histórico de Simulados</h3>
          {simulationHistory.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Você ainda não realizou nenhum simulado
              </p>
              <Button onClick={() => navigate("/simulation")} className="bg-gradient-primary">
                Fazer Simulado
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {simulationHistory.map((sim, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">Simulado #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sim.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{sim.score}</p>
                      <p className="text-sm text-muted-foreground">
                        {sim.passed ? "✅ Aprovado" : "❌ Reprovado"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Ranking (Premium Feature Preview) */}
        <Card className="mt-8 p-6 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🏆 Ranking Local</h3>
              <p className="text-white/90">
                Compare seu desempenho com outros estudantes
              </p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90">
              Ver Ranking (Premium)
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Performance;
