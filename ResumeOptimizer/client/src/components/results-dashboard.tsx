import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ResultsData {
  atsScore: number;
  seniorityLevel: string;
  experienceYears: number;
  domains: Array<{
    name: string;
    confidence: number;
    reasoning: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  skills: {
    current: string[];
    toHighlight: string[];
    inDemand: string[];
  };
  contentSuggestions: Array<{
    section: string;
    current: string;
    improved: string;
    reasoning: string;
  }>;
  optimizedResume: string;
  marketSalary: {
    estimated: number;
    currency: string;
    location: string;
  };
}

interface ResultsDashboardProps {
  results: ResultsData;
  analysisId: string;
}

export function ResultsDashboard({ results, analysisId }: ResultsDashboardProps) {
  const { toast } = useToast();

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/export/${analysisId}/${format}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimized_resume.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: `Your optimized resume has been downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(results.optimizedResume);
      toast({
        title: "Copied to clipboard",
        description: "Optimized resume text has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-20 px-6" data-testid="results-dashboard">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="results-title">
            Your Optimization Results
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="results-subtitle">
            AI-powered analysis complete. Here's how we can improve your resume.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center" data-testid="ats-score-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-chart-1 mb-2" data-testid="ats-score">
                {results.atsScore}%
              </div>
              <div className="text-sm text-muted-foreground">ATS Score</div>
              <div className="text-xs text-chart-1 mt-1">Optimized</div>
            </CardContent>
          </Card>
          
          <Card className="text-center" data-testid="seniority-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-chart-2 mb-2" data-testid="seniority-level">
                {results.seniorityLevel}
              </div>
              <div className="text-sm text-muted-foreground">Detected Level</div>
              <div className="text-xs text-chart-2 mt-1" data-testid="experience-years">
                {results.experienceYears} years experience
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center" data-testid="domain-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-chart-3 mb-2" data-testid="dominant-domain">
                {results.domains[0]?.name || 'General'}
              </div>
              <div className="text-sm text-muted-foreground">Best Domain Match</div>
              <div className="text-xs text-chart-3 mt-1" data-testid="domain-confidence">
                {Math.round(results.domains[0]?.confidence || 0)}% confidence
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center" data-testid="salary-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-chart-4 mb-2" data-testid="market-salary">
                ${results.marketSalary.estimated.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Market Salary</div>
              <div className="text-xs text-chart-4 mt-1" data-testid="salary-location">
                {results.marketSalary.location}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Domain Analysis */}
          <Card data-testid="domain-analysis-card">
            <CardHeader>
              <CardTitle data-testid="domain-analysis-title">Domain Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.domains.slice(0, 3).map((domain, index) => (
                  <div 
                    key={domain.name}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg",
                      index === 0 
                        ? "bg-accent/30 border border-primary/20" 
                        : "bg-muted/50"
                    )}
                    data-testid={`domain-match-${index}`}
                  >
                    <div>
                      <div className="font-medium" data-testid={`domain-name-${index}`}>
                        {domain.name}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`domain-reasoning-${index}`}>
                        {domain.reasoning}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-2xl font-bold",
                        index === 0 ? "text-chart-3" : "text-muted-foreground"
                      )} data-testid={`domain-confidence-${index}`}>
                        {Math.round(domain.confidence)}%
                      </div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Gap Analysis */}
          <Card data-testid="skills-analysis-card">
            <CardHeader>
              <CardTitle data-testid="skills-analysis-title">Skills Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Skills to highlight more</div>
                  <div className="flex flex-wrap gap-2" data-testid="skills-to-highlight">
                    {results.skills.toHighlight.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-chart-2/10 text-chart-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Skills in high demand</div>
                  <div className="flex flex-wrap gap-2" data-testid="skills-in-demand">
                    {results.skills.inDemand.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-chart-1/10 text-chart-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Your strong skills</div>
                  <div className="flex flex-wrap gap-2" data-testid="current-skills">
                    {results.skills.current.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Recommendations */}
        <Card className="mb-12" data-testid="recommendations-card">
          <CardHeader>
            <CardTitle data-testid="recommendations-title">Key Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {results.recommendations.slice(0, 4).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3" data-testid={`recommendation-${index}`}>
                  <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="font-medium" data-testid={`recommendation-title-${index}`}>
                      {rec.title}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`recommendation-description-${index}`}>
                      {rec.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <div className="text-center">
          <div className="bg-accent/30 rounded-2xl p-8 border border-primary/20" data-testid="export-section">
            <h3 className="text-2xl font-bold mb-4" data-testid="export-title">
              Ready to Export Your Optimized Resume?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto" data-testid="export-description">
              Your resume has been optimized based on real job market data. Export it in your preferred format and start applying to your dream jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => handleExport('pdf')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                data-testid="export-pdf-button"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExport('docx')}
                className="px-6 py-3 rounded-xl font-semibold"
                data-testid="export-docx-button"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download DOCX
              </Button>
              <Button 
                variant="outline"
                onClick={handleCopyText}
                className="px-6 py-3 rounded-xl font-semibold"
                data-testid="copy-text-button"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy Text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
