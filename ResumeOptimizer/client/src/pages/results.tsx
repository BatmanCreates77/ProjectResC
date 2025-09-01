import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface ResultsPageProps {
  analysisId: string;
}

export default function Results({ analysisId }: ResultsPageProps) {
  const [, setLocation] = useLocation();

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: ['/api/analysis', analysisId],
    enabled: !!analysisId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 glassmorphism">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 spinner mx-auto mb-6" data-testid="results-loading-spinner" />
                <h3 className="text-xl font-semibold mb-3" data-testid="results-loading-title">
                  Loading Results
                </h3>
                <p className="text-muted-foreground" data-testid="results-loading-text">
                  Retrieving your optimization analysis...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen gradient-hero">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3" data-testid="results-error-title">
                  Analysis Not Found
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="results-error-description">
                  {error?.message || "The requested analysis could not be found. It may have expired or been removed."}
                </p>
                <Button 
                  onClick={() => setLocation('/')}
                  data-testid="back-to-home-button"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Transform analysis data to match ResultsDashboard expected format
  const skillsData = analysis.skills as any || {};
  const recommendationsData = analysis.recommendations as any || {};
  const marketSalaryData = analysis.marketSalary as any || {};
  
  const resultsData = {
    atsScore: analysis.atsScore,
    seniorityLevel: analysis.seniorityLevel,
    experienceYears: parseFloat(analysis.experienceYears || "0"),
    domains: skillsData.domains || [],
    recommendations: recommendationsData.key || [],
    skills: {
      current: skillsData.current || [],
      toHighlight: skillsData.toHighlight || [],
      inDemand: skillsData.inDemand || []
    },
    contentSuggestions: recommendationsData.content || [],
    optimizedResume: analysis.optimizedContent || "",
    marketSalary: {
      estimated: marketSalaryData.estimated || 0,
      currency: marketSalaryData.currency || "USD",
      location: marketSalaryData.location || "Unknown"
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
        <ResultsDashboard 
          results={resultsData} 
          analysisId={analysisId}
        />
      </div>
      <Footer />
    </div>
  );
}
