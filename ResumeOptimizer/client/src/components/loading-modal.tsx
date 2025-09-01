import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoadingStep {
  title: string;
  text: string;
  duration: number;
}

const analysisSteps: LoadingStep[] = [
  { title: "Parsing Resume", text: "Claude AI is extracting text and structure...", duration: 2000 },
  { title: "Analyzing Experience", text: "Evaluating your career progression and skills...", duration: 3000 },
  { title: "Detecting Domains", text: "Matching your background to industry domains...", duration: 2500 },
  { title: "Market Research", text: "Scanning 30+ job postings for market insights...", duration: 4000 },
  { title: "Optimizing Content", text: "Enhancing your resume with AI recommendations...", duration: 3500 },
  { title: "Finalizing Results", text: "Preparing your optimization report...", duration: 2000 }
];

export function LoadingModal({ isOpen, onClose }: LoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let totalElapsed = 0;
    const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);

    const runStep = () => {
      if (stepIndex >= analysisSteps.length) {
        onClose();
        return;
      }

      const step = analysisSteps[stepIndex];
      setCurrentStep(stepIndex);

      // Animate progress for this step
      const stepStart = totalElapsed / totalDuration * 100;
      const stepEnd = (totalElapsed + step.duration) / totalDuration * 100;
      
      const startTime = Date.now();
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const stepProgress = Math.min(elapsed / step.duration, 1);
        const currentProgress = stepStart + (stepEnd - stepStart) * stepProgress;
        
        setProgress(currentProgress);

        if (stepProgress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };

      animateProgress();
      totalElapsed += step.duration;
      stepIndex++;

      setTimeout(runStep, step.duration);
    };

    runStep();
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="glassmorphism max-w-md" data-testid="loading-modal">
        <DialogTitle className="sr-only">
          Resume Analysis in Progress
        </DialogTitle>
        <DialogDescription className="sr-only">
          AI is analyzing your resume and generating optimization recommendations
        </DialogDescription>
        <div className="text-center">
          <div className="w-16 h-16 spinner mx-auto mb-6" data-testid="loading-spinner" />
          <h3 className="text-xl font-semibold mb-3" data-testid="loading-title">
            {analysisSteps[currentStep]?.title || "Processing..."}
          </h3>
          <p className="text-muted-foreground mb-6" data-testid="loading-text">
            {analysisSteps[currentStep]?.text || "Please wait..."}
          </p>
          
          <Progress value={progress} className="w-full mb-4" data-testid="progress-bar" />
          
          <p className="text-sm text-muted-foreground" data-testid="progress-text">
            {Math.round(progress)}% complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
