import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UploadZone } from "@/components/upload-zone";
import { LoadingModal } from "@/components/loading-modal";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  success: boolean;
  resumeId: string;
  analysisId: string;
  results: any;
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (file: File): Promise<AnalysisResult> => {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setShowLoading(false);
      setAnalysisResult(data);
    },
    onError: (error) => {
      setShowLoading(false);
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    setShowLoading(true);
    analysisMutation.mutate(file);
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen gradient-hero">
        <Header />
        <ResultsDashboard 
          results={analysisResult.results} 
          analysisId={analysisResult.analysisId}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6" data-testid="hero-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent border border-border mb-8" data-testid="hero-badge">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">Free • No Signup Required • Results in 2 Minutes</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up" data-testid="hero-title">
              Free <span className="text-gradient">AI Resume</span><br/>
              Optimization
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up" style={{animationDelay: '0.1s'}} data-testid="hero-subtitle">
              for Product Designers
            </p>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}} data-testid="hero-description">
              Upload your resume and get AI-powered optimization with real job market insights. 
              Land your dream job at Google, Apple, Meta, and other top companies.
            </p>
          </div>

          <UploadZone 
            onFileSelect={handleFileSelect} 
            isUploading={analysisMutation.isPending}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" data-testid="features-section" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="features-title">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="features-description">
              Our AI analyzes your resume against real job market data to provide personalized optimization recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center floating-card border-0 bg-card/50" data-testid="feature-ai-analysis">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-chart-1 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-muted-foreground">Claude AI understands your career background, skills, and experience level to provide intelligent insights</p>
              </CardContent>
            </Card>

            <Card className="text-center floating-card border-0 bg-card/50" data-testid="feature-job-intelligence">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-chart-2 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Job Market Intelligence</h3>
                <p className="text-muted-foreground">Real-time analysis of 30+ job postings from LinkedIn and Indeed to understand current market demands</p>
              </CardContent>
            </Card>

            <Card className="text-center floating-card border-0 bg-card/50" data-testid="feature-ats-optimization">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-chart-3 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ATS Optimization</h3>
                <p className="text-muted-foreground">Maximize compatibility with Applicant Tracking Systems while maintaining human readability</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-muted/30" data-testid="demo-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="demo-title">See the Difference</h2>
            <p className="text-lg text-muted-foreground" data-testid="demo-description">
              Before and after optimization comparison
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Before Card */}
            <Card data-testid="before-optimization-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
                  <h3 className="font-semibold">Before Optimization</h3>
                  <div className="ml-auto bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm" data-testid="before-ats-score">
                    ATS Score: 62%
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg" data-testid="before-experience-example">
                    <p className="font-medium mb-1">Product Designer at TechCorp</p>
                    <p className="text-muted-foreground">Designed user interfaces and improved user experience for web applications.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg" data-testid="before-skills-example">
                    <p className="font-medium mb-1">Skills</p>
                    <p className="text-muted-foreground">Figma, Sketch, Design, User Experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* After Card */}
            <Card data-testid="after-optimization-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-chart-2 rounded-full mr-2"></div>
                  <h3 className="font-semibold">After Optimization</h3>
                  <div className="ml-auto bg-chart-2/10 text-chart-2 px-3 py-1 rounded-full text-sm" data-testid="after-ats-score">
                    ATS Score: 94%
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-accent/30 rounded-lg border border-primary/20" data-testid="after-experience-example">
                    <p className="font-medium mb-1">Senior Product Designer at TechCorp</p>
                    <p className="text-muted-foreground">Led end-to-end product design for 3 web applications, increasing user engagement by 40% through data-driven UX improvements and A/B testing methodologies.</p>
                  </div>
                  <div className="p-3 bg-accent/30 rounded-lg border border-primary/20" data-testid="after-skills-example">
                    <p className="font-medium mb-1">Core Skills</p>
                    <p className="text-muted-foreground">Figma, Sketch, Adobe Creative Suite, User Research, Prototyping, Design Systems, A/B Testing, Data Analytics, Stakeholder Management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 bg-card/70" data-testid="metric-ats-improvement">
              <div className="text-2xl font-bold text-chart-1 mb-2">+32%</div>
              <div className="text-sm text-muted-foreground">ATS Score Improvement</div>
            </Card>
            <Card className="text-center p-6 border-0 bg-card/70" data-testid="metric-domain-match">
              <div className="text-2xl font-bold text-chart-2 mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Domain Match Confidence</div>
            </Card>
            <Card className="text-center p-6 border-0 bg-card/70" data-testid="metric-skills-added">
              <div className="text-2xl font-bold text-chart-3 mb-2">12</div>
              <div className="text-sm text-muted-foreground">Skills Added</div>
            </Card>
            <Card className="text-center p-6 border-0 bg-card/70" data-testid="metric-market-salary">
              <div className="text-2xl font-bold text-chart-4 mb-2">$120K</div>
              <div className="text-sm text-muted-foreground">Avg. Market Salary</div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      <LoadingModal 
        isOpen={showLoading} 
        onClose={() => setShowLoading(false)} 
      />
    </div>
  );
}
