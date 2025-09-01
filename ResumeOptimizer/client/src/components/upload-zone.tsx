import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function UploadZone({ onFileSelect, isUploading = false }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 5MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please upload a PDF or TXT file');
      } else {
        setError('Invalid file');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone glassmorphism rounded-2xl p-12 max-w-2xl mx-auto mb-8 cursor-pointer transition-all duration-300",
          isDragActive && "dragover",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        data-testid="upload-zone"
      >
        <input {...getInputProps()} data-testid="file-input" />
        
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className={cn(
              "w-16 h-16 bg-primary rounded-2xl flex items-center justify-center transition-transform",
              !isUploading && "animate-float"
            )}>
              {isUploading ? (
                <div className="w-8 h-8 spinner" />
              ) : (
                <Upload className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            {!isUploading && (
              <div className="absolute inset-0 w-16 h-16 bg-primary rounded-2xl pulse-ring" />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2" data-testid="upload-title">
              {isUploading ? "Processing Resume..." : "Upload Your Resume"}
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="upload-description">
              {isUploading 
                ? "Claude AI is analyzing your resume..." 
                : "Drag and drop your resume here, or click to browse"
              }
            </p>
            <p className="text-sm text-muted-foreground" data-testid="file-requirements">
              Supports PDF and TXT files (max 5MB)
            </p>
          </div>
          
          {!isUploading && (
            <Button 
              size="lg" 
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
              data-testid="choose-file-button"
            >
              <FileText className="w-5 h-5 mr-2" />
              Choose File
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center justify-center space-x-2 text-destructive text-sm mb-4" data-testid="upload-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-16 text-center" data-testid="privacy-notice">
        🔒 Your resume is processed securely and never stored permanently
      </p>
    </div>
  );
}
