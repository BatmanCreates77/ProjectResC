import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { claudeService } from "./services/claude";
import multer from "multer";
import pdfParse from "pdf-parse";
import { insertResumeSchema, insertAnalysisSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Resume upload and analysis endpoint
  app.post("/api/analyze", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract text from file
      let resumeText: string;
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }

      if (!resumeText.trim()) {
        return res.status(400).json({ error: "Could not extract text from file" });
      }

      // Create resume record
      const resumeData = insertResumeSchema.parse({
        userId: null, // Anonymous for now
        filename: req.file.originalname,
        originalText: resumeText,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });

      const resume = await storage.createResume(resumeData);

      // Parse resume with Claude AI
      const parsedResume = await claudeService.parseResume(resumeText);
      
      // Analyze domains and seniority
      const domainAnalysis = await claudeService.analyzeDomains(parsedResume);
      
      // Generate optimization recommendations
      const optimizations = await claudeService.generateOptimizations(
        parsedResume, 
        domainAnalysis
      );

      // Create analysis record
      const analysisData = insertAnalysisSchema.parse({
        resumeId: resume.id,
        seniorityLevel: domainAnalysis.seniorityLevel,
        experienceYears: domainAnalysis.experienceYears.toString(),
        dominantDomain: domainAnalysis.domains[0]?.name,
        domainConfidence: domainAnalysis.domains[0]?.confidence.toString(),
        atsScore: domainAnalysis.atsScore,
        skills: {
          current: parsedResume.skills,
          toHighlight: optimizations.skillsToHighlight,
          inDemand: optimizations.skillsInDemand,
        },
        recommendations: {
          key: optimizations.keyRecommendations,
          content: optimizations.contentSuggestions,
        },
        optimizedContent: optimizations.optimizedResume,
        marketSalary: {
          estimated: 120000, // Mock data for now
          currency: 'USD',
          location: 'San Francisco',
        },
      });

      const analysis = await storage.createAnalysis(analysisData);

      // Return comprehensive results
      res.json({
        success: true,
        resumeId: resume.id,
        analysisId: analysis.id,
        results: {
          atsScore: domainAnalysis.atsScore,
          seniorityLevel: domainAnalysis.seniorityLevel,
          experienceYears: domainAnalysis.experienceYears,
          domains: domainAnalysis.domains,
          recommendations: optimizations.keyRecommendations,
          skills: {
            current: parsedResume.skills,
            toHighlight: optimizations.skillsToHighlight,
            inDemand: optimizations.skillsInDemand,
          },
          contentSuggestions: optimizations.contentSuggestions,
          optimizedResume: optimizations.optimizedResume,
          marketSalary: {
            estimated: 120000,
            currency: 'USD',
            location: 'San Francisco',
          },
        },
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to analyze resume" 
      });
    }
  });

  // Get analysis results
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Failed to get analysis:', error);
      res.status(500).json({ error: "Failed to retrieve analysis" });
    }
  });

  // Export optimized resume
  app.get("/api/export/:analysisId/:format", async (req, res) => {
    try {
      const { analysisId, format } = req.params;
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      const optimizedContent = analysis.optimizedContent;
      
      switch (format) {
        case 'pdf':
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="optimized_resume.pdf"`);
          // For now, return text content - PDF generation would require additional libraries
          res.send(optimizedContent);
          break;
        case 'txt':
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Disposition', `attachment; filename="optimized_resume.txt"`);
          res.send(optimizedContent);
          break;
        case 'docx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', `attachment; filename="optimized_resume.docx"`);
          // For now, return text content - DOCX generation would require additional libraries
          res.send(optimizedContent);
          break;
        default:
          res.status(400).json({ error: "Unsupported format" });
      }
    } catch (error) {
      console.error('Export failed:', error);
      res.status(500).json({ error: "Failed to export resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
