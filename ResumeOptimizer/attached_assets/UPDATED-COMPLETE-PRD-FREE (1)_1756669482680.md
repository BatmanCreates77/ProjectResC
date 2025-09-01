# ResumeOptimizer Pro - Complete PRD & Requirements Document
## Free AI-Powered Resume Optimization Platform - Replit Development

**Project**: ResumeOptimizer Pro (Free Version)  
**Version**: 1.0 MVP  
**Date**: September 1, 2025  
**Target**: Product designers seeking roles at top-tier companies  
**Development Platform**: Replit with budget optimization

---

## 🎯 PROJECT OVERVIEW

### **Core Mission**
Provide **completely free AI-powered resume optimization** for product designers, helping them land roles at Google, Apple, Meta, and other top companies through personalized, data-driven insights.

### **Core Value Proposition**
1. **AI-Powered Personalization**: Claude AI analyzes user background and career trajectory
2. **Experience-Weighted Domain Matching**: Intelligent suggestions based on actual work history
3. **Real Job Market Intelligence**: Live scraping of 30+ matching job postings
4. **Dual Optimization**: Market relevance + ATS compatibility in one solution
5. **Location-Aware Insights**: Local currency salary data and regional market trends
6. **Completely Free**: No payment barriers, registration optional

### **Target Users**
- Product designers actively job searching
- Career changers looking to enter design
- Designers seeking better opportunities
- International designers targeting specific markets

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Core Technology Stack**
```javascript
{
  "framework": "Next.js 14 with TypeScript",
  "ui": "Radix UI Themes + radix-themes-tw preset",
  "styling": "Tailwind CSS v4 with Radix integration", 
  "database": "PostgreSQL with Prisma ORM",
  "ai": "Claude AI (Anthropic) for resume analysis and optimization",
  "scraping": "Puppeteer for LinkedIn/Indeed job data",
  "auth": "NextAuth.js (optional registration)",
  "deployment": "Vercel with automatic scaling"
}
```

### **Essential Dependencies**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "@radix-ui/themes": "^2.0.3",
    "radix-themes-tw": "^1.0.0",
    "@radix-ui/react-icons": "^1.3.0",
    "@prisma/client": "^5.7.1",
    "@anthropic-ai/sdk": "^0.24.1",
    "pdf-parse": "^1.1.1",
    "puppeteer": "^21.6.1",
    "next-auth": "^4.24.5",
    "zod": "^3.22.4",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.48.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/pdf-parse": "^1.1.4",
    "typescript": "^5.3.3",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "prisma": "^5.7.1"
  }
}
```

### **Radix UI + Tailwind Integration**
```css
/* styles/globals.css */
@import "radix-themes-tw";

/* This preset provides:
- Radix color tokens (--accent-1, --tomato-1, etc.)
- Tailwind classes with Radix values (bg-accent-1, text-tomato-9)
- Radix spacing with rx- prefix (px-rx-2, my-rx-4)
- Complete design system integration
*/
```

---

## 📊 DATABASE SCHEMA (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String    @id @default(cuid())
  email            String?   @unique
  name             String?
  targetLocation   String?
  preferredCurrency String?   @default("usd")
  resumes          Resume[]
  analyses         Analysis[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  @@map("users")
}

model Resume {
  id           String     @id @default(cuid())
  userId       String?
  fileName     String
  originalText String     @db.Text
  parsedData   Json       // Claude AI structured extraction
  uploadedAt   DateTime   @default(now())
  user         User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  analyses     Analysis[]
  @@map("resumes")
}

model Analysis {
  id                    String   @id @default(cuid())
  resumeId              String
  userId                String?
  targetDomain          String   // Selected domain (fintech, b2b_saas, etc.)
  targetLocation        String   // San Francisco, London, etc.
  targetCurrency        String   @default("usd")
  detectedSeniority     String   // Junior, Mid, Senior, Staff
  experienceYears       Float    // Calculated years including overlaps
  domainConfidence      Float    // 0-100 confidence score for selected domain
  domainSuggestions     Json     // All domain matches with reasoning
  originalAtsScore      Int      // Initial ATS compatibility
  optimizedAtsScore     Int      // Post-optimization ATS score
  skillsGap             Json     // Missing vs present skills analysis
  marketInsights        Json     // Salary, companies, trends
  jobPostingsAnalyzed   Int      // Number of jobs scraped and analyzed
  optimizedContent      String?  @db.Text // Complete optimized resume
  recommendations       Json     // Actionable improvement suggestions
  customJobUrl          String?  // Specific job URL analysis (if provided)
  createdAt             DateTime @default(now())
  user                  User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume                Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  @@map("analyses")
}

model JobPosting {
  id            String   @id @default(cuid())
  company       String
  title         String
  description   String   @db.Text
  requirements  Json     // Structured requirements extraction
  location      String
  domain        String   // fintech, b2b_saas, healthcare, etc.
  seniorityLevel String  // junior, mid, senior, staff
  salaryMin     Int?
  salaryMax     Int?
  currency      String   @default("usd")
  postedDate    DateTime
  sourceUrl     String
  sourcePlatform String  // linkedin, indeed, company_page
  scrapedAt     DateTime @default(now())
  isActive      Boolean  @default(true)
  
  @@index([domain, location, seniorityLevel, isActive])
  @@index([scrapedAt])
  @@map("job_postings")
}

model DomainKeywords {
  id       String   @id @default(cuid())
  domain   String   @unique // fintech, b2b_saas, healthcare, etc.
  keywords Json     // High-frequency keywords for this domain
  companies Json    // Companies typically in this domain
  skills   Json     // Common skill requirements
  updatedAt DateTime @updatedAt
  @@map("domain_keywords")
}

model SalaryData {
  id            String   @id @default(cuid())
  location      String
  domain        String
  seniorityLevel String
  currency      String
  minSalary     Int
  maxSalary     Int
  avgSalary     Int
  medianSalary  Int
  source        String   // glassdoor, levels_fyi, linkedin, job_postings
  dataPoints    Int      // Number of salary samples
  updatedAt     DateTime @updatedAt
  
  @@unique([location, domain, seniorityLevel, source])
  @@map("salary_data")
}
```

---

## 🔄 COMPLETE USER JOURNEY & FLOW

### **Step 1: Landing Page** (30 seconds)
```
Landing Page Features:
├── Clear value proposition: "Free AI Resume Optimization for Product Designers"
├── Social proof: "Powered by Claude AI - Used by designers at top companies"
├── Single CTA: "Upload Resume for Free Analysis"
├── Benefits section: AI analysis, job market insights, ATS optimization
├── No signup required - immediate access
└── Professional design with Radix UI components
```

**Landing Page UI:**
```tsx
import { Button, Card, Text, Flex, Grid } from "@radix-ui/themes";
import { UploadIcon, StarIcon, CheckIcon } from "@radix-ui/react-icons";

// Hero Section
<Card size="4" className="text-center bg-accent-2">
  <Text size="8" weight="bold" className="text-accent-11">
    Free AI Resume Optimization
  </Text>
  <Text size="6" weight="medium" className="text-accent-11">
    for Product Designers
  </Text>
  <Text size="3" className="text-gray-11 mt-4">
    Upload → AI Analysis → Optimized Resume → Land Dream Job
  </Text>
  <Button size="4" className="bg-accent-9 text-accent-1 mt-6">
    <UploadIcon /> Upload Resume for Free Analysis
  </Button>
  <Text size="2" className="text-gray-9 mt-2">
    No signup required • Results in 2 minutes • Completely free
  </Text>
</Card>

// Benefits Section
<Grid columns="3" gap="4" className="mt-8">
  <Card className="text-center">
    <StarIcon size="32" className="text-accent-9 mx-auto" />
    <Text size="3" weight="bold" className="mt-2">Claude AI Analysis</Text>
    <Text size="2" className="text-gray-11">Advanced AI understands your career background</Text>
  </Card>
  <Card className="text-center">
    <CheckIcon size="32" className="text-green-9 mx-auto" />
    <Text size="3" weight="bold" className="mt-2">Job Market Intelligence</Text>
    <Text size="2" className="text-gray-11">Real job data from 30+ current postings</Text>
  </Card>
  <Card className="text-center">
    <UploadIcon size="32" className="text-blue-9 mx-auto" />
    <Text size="3" weight="bold" className="mt-2">ATS Optimization</Text>
    <Text size="2" className="text-gray-11">Maximize compatibility with AI screening</Text>
  </Card>
</Grid>
```

### **Step 2: Resume Upload** (45 seconds)
```
Upload Process:
├── Drag-and-drop interface with react-dropzone
├── PDF/TXT support with 5MB limit
├── Real-time upload progress
├── File validation and error handling
├── PDF text extraction with pdf-parse
└── Immediate Claude AI analysis initiation
```

### **Step 3: Claude AI Analysis** (90-120 seconds)
```
Analysis Process:
├── Resume parsing and text extraction
├── Experience timeline construction
├── Skills categorization and assessment
├── Domain detection with confidence scoring
├── Seniority level determination
└── Career progression analysis
```

### **Step 4: Smart Domain Selection** (30 seconds)
```
Domain Selection Features:
├── AI-ranked suggestions with confidence scores
├── Experience evidence for each domain
├── Pre-selected highest confidence match
├── Domain mismatch warnings
└── Transition strategies for low-confidence selections
```

### **Step 5: Location Targeting** (30 seconds)
```
Location Selection:
├── Popular tech hubs with salary previews
├── Local currency auto-detection
├── Cost of living context
├── Remote work option
└── Custom location input
```

### **Step 6: Job Market Scanning** (90-180 seconds)
```
Market Intelligence:
├── LinkedIn and Indeed job scraping
├── 30+ job postings analysis
├── Requirements extraction with Claude AI
├── Market trends and salary insights
└── Real-time progress updates
```

### **Step 7: AI Resume Optimization** (120-180 seconds)
```
Optimization Process:
├── Market-based keyword integration
├── Achievement quantification
├── ATS compatibility enhancement
├── Skills gap identification
├── Industry-specific language adaptation
└── Final quality review
```

### **Step 8: Results Dashboard** (60+ seconds)
```
Results Display:
├── Split-view: Original vs Optimized
├── ATS score improvement (before/after)
├── Market fit analysis with confidence
├── Skills gap recommendations
├── Domain match explanation
└── Export options (PDF, DOCX, TXT)
```

---

## 🤖 AI INTEGRATION (Claude AI)

### **Resume Analysis Function**
```javascript
// lib/ai/claude.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeResumeWithClaude(resumeText) {
  const prompt = `
Analyze this product designer resume and extract structured data:

RESUME TEXT:
${resumeText}

Return comprehensive JSON analysis with:
{
  "personalInfo": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "portfolio": "string",
    "linkedin": "string"
  },
  "experience": [
    {
      "company": "string",
      "title": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM", 
      "description": "string",
      "achievements": ["string"],
      "skills": ["string"]
    }
  ],
  "skills": {
    "design": ["Figma", "Sketch", "Adobe Creative Suite"],
    "technical": ["HTML/CSS", "JavaScript", "React"],
    "research": ["User Testing", "Analytics", "Surveys"], 
    "business": ["Stakeholder Management", "Strategy"]
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "graduationDate": "YYYY",
      "relevantCoursework": ["string"]
    }
  ],
  "seniority": {
    "level": "junior|mid|senior|staff",
    "yearsExperience": number,
    "confidence": number,
    "reasoning": "string",
    "indicators": ["string"]
  },
  "domains": [
    {
      "name": "fintech|b2b_saas|healthcare|e_commerce|consumer_social|enterprise",
      "yearsExperience": number,
      "confidence": number,
      "evidence": ["string"],
      "companies": ["string"],
      "projects": ["string"]
    }
  ],
  "achievements": {
    "quantified": ["string"],
    "qualitative": ["string"],
    "impactLevel": "low|medium|high"
  }
}

Focus on accuracy and provide confidence scores for all assessments.
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Claude analysis error:', error);
    throw new Error('Resume analysis failed');
  }
}
```

### **Resume Optimization Function**
```javascript
export async function optimizeResumeWithClaude({
  originalResume,
  parsedData, 
  jobMarketData,
  targetDomain,
  targetLocation
}) {
  const prompt = `
Optimize this resume for ${targetDomain} ${parsedData.seniority.level} designer roles in ${targetLocation}:

CURRENT RESUME:
${originalResume}

JOB MARKET INSIGHTS:
- Jobs analyzed: ${jobMarketData.jobsAnalyzed}
- Top keywords: ${jobMarketData.topKeywords.join(', ')}
- Required skills: ${jobMarketData.requiredSkills.join(', ')}
- Common achievements: ${jobMarketData.achievementPatterns.join(', ')}
- Salary range: ${jobMarketData.salaryRange}

OPTIMIZATION GOALS:
1. Market Relevance: Incorporate high-frequency keywords naturally
2. ATS Compatibility: Proper structure, headers, and formatting
3. Impact Quantification: Add metrics and measurable outcomes
4. Skills Alignment: Highlight relevant capabilities, identify gaps
5. Domain Expertise: Use industry-specific terminology
6. Achievement Enhancement: Follow successful patterns from market

Return detailed optimization results:
{
  "optimizedContent": "complete optimized resume text",
  "improvements": [
    {
      "section": "Experience|Skills|Education",
      "original": "original text",
      "optimized": "optimized version", 
      "reasoning": "why this change improves the resume",
      "keywords": ["added keywords"],
      "impact": "ATS|readability|market_fit"
    }
  ],
  "skillsGap": {
    "missing": ["skills present in market but not in resume"],
    "recommendations": ["specific learning suggestions"],
    "priority": ["high|medium|low priority for each"]
  },
  "atsScore": {
    "original": number,
    "optimized": number,
    "improvements": ["specific ATS enhancements made"]
  },
  "marketFit": {
    "domainAlignment": number,
    "keywordDensity": number,
    "experienceRelevance": number
  }
}
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 6000,
      messages: [{
        role: 'user', 
        content: prompt
      }]
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Claude optimization error:', error);
    throw new Error('Resume optimization failed');
  }
}
```

---

## 🔌 API IMPLEMENTATION

### **POST /api/upload**
```javascript
// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { parsePDF } from '@/lib/pdf-parser';
import { analyzeResumeWithClaude } from '@/lib/ai/claude';
import { prisma } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file
    if (!['application/pdf', 'text/plain'].includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF and TXT files are supported.' });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    // Extract text
    const resumeText = await parsePDF(file.filepath);
    
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ error: 'Unable to extract text from resume. Please ensure the file contains readable text.' });
    }

    // Claude AI analysis
    const analysis = await analyzeResumeWithClaude(resumeText);
    
    // Save to database
    const resume = await prisma.resume.create({
      data: {
        fileName: file.originalFilename,
        originalText: resumeText,
        parsedData: analysis
      }
    });

    res.status(200).json({
      success: true,
      resumeId: resume.id,
      analysis
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      details: error.message 
    });
  }
}
```

### **POST /api/analyze**
```javascript
// pages/api/analyze.js
import { analyzeJobMarket } from '@/lib/job-market/analyzer';
import { optimizeResumeWithClaude } from '@/lib/ai/claude';
import { calculateATSScore } from '@/lib/ats/calculator';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeId, targetDomain, targetLocation, targetSeniority } = req.body;

    // Validate required fields
    if (!resumeId || !targetDomain || !targetLocation || !targetSeniority) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['resumeId', 'targetDomain', 'targetLocation', 'targetSeniority']
      });
    }

    // Get resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Scrape and analyze job market
    const jobMarketData = await analyzeJobMarket({
      domain: targetDomain,
      location: targetLocation,
      seniority: targetSeniority,
      maxJobs: 30
    });

    // Calculate initial ATS score
    const originalAtsScore = calculateATSScore(resume.originalText);

    // Optimize resume with Claude AI
    const optimization = await optimizeResumeWithClaude({
      originalResume: resume.originalText,
      parsedData: resume.parsedData,
      jobMarketData,
      targetDomain,
      targetLocation
    });

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        resumeId,
        targetDomain,
        targetLocation,
        targetCurrency: getCurrencyForLocation(targetLocation),
        detectedSeniority: targetSeniority,
        experienceYears: resume.parsedData.seniority?.yearsExperience || 0,
        domainConfidence: getDomainConfidence(resume.parsedData.domains, targetDomain),
        domainSuggestions: resume.parsedData.domains || [],
        originalAtsScore,
        optimizedAtsScore: optimization.atsScore.optimized,
        jobPostingsAnalyzed: jobMarketData.jobsAnalyzed,
        marketInsights: jobMarketData,
        optimizedContent: optimization.optimizedContent,
        recommendations: optimization.improvements,
        skillsGap: optimization.skillsGap
      }
    });

    res.status(200).json({
      success: true,
      analysis,
      jobMarketData,
      optimization
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
}

function getCurrencyForLocation(location) {
  const currencyMap = {
    'san_francisco': 'usd',
    'new_york': 'usd',
    'london': 'gbp',
    'bangalore': 'inr',
    'berlin': 'eur',
    'toronto': 'cad',
    'sydney': 'aud'
  };
  return currencyMap[location.toLowerCase().replace(/\s+/g, '_')] || 'usd';
}

function getDomainConfidence(domains, targetDomain) {
  const domain = domains?.find(d => d.name === targetDomain);
  return domain?.confidence || 0;
}
```

### **POST /api/export**
```javascript
// pages/api/export.js
import { generatePDF } from '@/lib/export/pdf-generator';
import { generateDOCX } from '@/lib/export/docx-generator';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analysisId, format = 'pdf' } = req.body;

    if (!analysisId) {
      return res.status(400).json({ error: 'Analysis ID required' });
    }

    // Get analysis with optimized content
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { resume: true }
    });

    if (!analysis || !analysis.optimizedContent) {
      return res.status(404).json({ error: 'Analysis or optimized content not found' });
    }

    let fileBuffer;
    let mimeType;
    let fileName;

    switch (format.toLowerCase()) {
      case 'pdf':
        fileBuffer = await generatePDF(analysis.optimizedContent);
        mimeType = 'application/pdf';
        fileName = 'optimized-resume.pdf';
        break;
      case 'docx':
        fileBuffer = await generateDOCX(analysis.optimizedContent);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileName = 'optimized-resume.docx';
        break;
      case 'txt':
        fileBuffer = Buffer.from(analysis.optimizedContent, 'utf-8');
        mimeType = 'text/plain';
        fileName = 'optimized-resume.txt';
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Export failed',
      details: error.message 
    });
  }
}
```

---

## 🎨 UI COMPONENT EXAMPLES

### **Upload Zone Component**
```tsx
// components/ui/upload-zone.tsx
import { Card, Text, Button, Progress } from '@radix-ui/themes';
import { UploadIcon, FileTextIcon } from '@radix-ui/react-icons';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export function UploadZone({ onFileUpload, uploading = false }) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0) {
        onFileUpload(files[0]);
      }
    }
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`
        border-2 border-dashed cursor-pointer transition-all duration-200 p-rx-6
        ${isDragActive 
          ? 'border-accent-8 bg-accent-3 scale-102' 
          : 'border-gray-6 bg-gray-2 hover:border-accent-7 hover:bg-accent-2'
        }
      `}
      size="4"
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-rx-4">
        <UploadIcon 
          size="48" 
          className={`mx-auto transition-colors ${
            isDragActive ? 'text-accent-10' : 'text-gray-9'
          }`} 
        />
        
        {!uploading ? (
          <>
            <div>
              <Text size="4" weight="medium" className="block">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </Text>
              <Text size="2" className="text-gray-9 mt-1">
                PDF or TXT • Max 5MB • Secure & Private
              </Text>
            </div>
            <Button 
              variant="outline" 
              className="bg-accent-3 border-accent-7 text-accent-11 hover:bg-accent-4"
            >
              <FileTextIcon /> Choose File
            </Button>
          </>
        ) : (
          <div className="space-y-rx-3">
            <Text size="3" weight="medium" className="text-accent-11">
              Analyzing with Claude AI...
            </Text>
            <Progress value={uploadProgress} className="w-full" />
            <Text size="2" className="text-accent-9">
              Processing your resume • This may take up to 2 minutes
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
}
```

### **Domain Selection Component**
```tsx
// components/ui/domain-card.tsx
import { Card, Badge, Progress, Button, Flex, Text, Callout } from '@radix-ui/themes';
import { StarIcon, ExclamationTriangleIcon, CheckIcon } from '@radix-ui/react-icons';

export function DomainCard({ 
  domain, 
  isSelected, 
  onSelect, 
  isHighConfidence, 
  isMediumConfidence,
  isLowConfidence 
}) {
  const getCardStyle = () => {
    if (isSelected && isHighConfidence) return 'border-2 border-green-7 bg-green-2';
    if (isSelected && isMediumConfidence) return 'border-2 border-blue-7 bg-blue-2';
    if (isSelected && isLowConfidence) return 'border-2 border-orange-7 bg-orange-2';
    return 'border border-gray-6 bg-gray-1 hover:bg-gray-2';
  };

  const getBadgeColor = () => {
    if (isHighConfidence) return 'green';
    if (isMediumConfidence) return 'blue';
    return 'orange';
  };

  const getBadgeText = () => {
    if (isHighConfidence) return 'BEST MATCH';
    if (isMediumConfidence) return 'GOOD FIT';
    return 'LOW MATCH';
  };

  const getBadgeIcon = () => {
    if (isHighConfidence) return <StarIcon />;
    if (isMediumConfidence) return <CheckIcon />;
    return <ExclamationTriangleIcon />;
  };

  return (
    <Card className={getCardStyle()}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="start">
          <Flex direction="column" gap="3" className="flex-1">
            <Flex align="center" gap="2">
              <Badge color={getBadgeColor()} size="2">
                {getBadgeIcon()} {getBadgeText()}
              </Badge>
              <Text size="4" weight="bold" className={`text-${getBadgeColor()}-11`}>
                {domain.displayName}
              </Text>
            </Flex>
            
            <Text size="2" className="text-gray-11">
              {domain.evidence}
            </Text>
            
            <div>
              <Progress value={domain.confidence} className="w-full" color={getBadgeColor()} />
              <Text size="1" className={`text-${getBadgeColor()}-9 mt-1`}>
                {domain.confidence}% confidence match
              </Text>
            </div>
            
            {domain.keywords && (
              <div className="flex flex-wrap gap-1">
                {domain.keywords.slice(0, 3).map((keyword, idx) => (
                  <Badge key={idx} size="1" className={`bg-${getBadgeColor()}-3 text-${getBadgeColor()}-11`}>
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </Flex>
          
          <Button 
            variant={isSelected ? "solid" : "outline"}
            color={getBadgeColor()}
            onClick={() => onSelect(domain)}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </Flex>
        
        {isSelected && isLowConfidence && (
          <Callout.Root color="orange" className="mt-3">
            <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
            <Callout.Text>
              <Text weight="bold">Honest Assessment:</Text> Limited experience in this domain. 
              Consider transition strategies or focus on your stronger background.
            </Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </Card>
  );
}
```

### **Results Split View Component**
```tsx
// components/ui/results-comparison.tsx
import { Card, Grid, Text, Badge, Progress, Flex } from '@radix-ui/themes';
import { CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons';

export function ResultsComparison({ originalContent, optimizedContent, improvements }) {
  return (
    <Card>
      <Flex justify="between" align="center" className="mb-4">
        <Text size="5" weight="bold">Resume Optimization Results</Text>
        <Badge color="green" size="2">Analysis Complete</Badge>
      </Flex>
      
      <Grid columns="2" gap="4">
        <Card>
          <Text size="3" weight="medium" className="text-gray-11 mb-3">
            Your Original Content
          </Text>
          <Card variant="surface" className="p-4">
            <Text size="2" className="leading-relaxed">
              {originalContent}
            </Text>
          </Card>
        </Card>
        
        <Card>
          <Text size="3" weight="medium" className="text-green-11 mb-3">
            AI-Optimized Version
          </Text>
          <Card variant="surface" className="p-4 border-l-4 border-green-7">
            <Text size="2" className="leading-relaxed">
              {optimizedContent}
            </Text>
          </Card>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {improvements.keywords.map((keyword, idx) => (
              <Badge key={idx} size="1" color="green">
                +{keyword}
              </Badge>
            ))}
          </div>
        </Card>
      </Grid>
      
      <Grid columns="3" gap="3" className="mt-6">
        <Card variant="surface" className="text-center">
          <Text size="2" className="text-gray-9">ATS Score</Text>
          <Flex align="center" justify="center" gap="2" className="mt-1">
            <Text size="4" weight="bold" className="text-gray-11">
              {improvements.atsScore.original}
            </Text>
            <ArrowRightIcon className="text-gray-9" />
            <Text size="4" weight="bold" className="text-green-11">
              {improvements.atsScore.optimized}
            </Text>
          </Flex>
          <Text size="1" className="text-green-9">
            +{improvements.atsScore.optimized - improvements.atsScore.original} improvement
          </Text>
        </Card>
        
        <Card variant="surface" className="text-center">
          <Text size="2" className="text-gray-9">Keywords Added</Text>
          <Text size="4" weight="bold" className="text-blue-11 mt-1">
            {improvements.keywords.length}
          </Text>
          <Text size="1" className="text-blue-9">High-impact terms</Text>
        </Card>
        
        <Card variant="surface" className="text-center">
          <Text size="2" className="text-gray-9">Achievements Enhanced</Text>
          <Text size="4" weight="bold" className="text-purple-11 mt-1">
            {improvements.achievements || 0}
          </Text>
          <Text size="1" className="text-purple-9">With metrics</Text>
        </Card>
      </Grid>
    </Card>
  );
}
```

---

## 🚀 SUCCESS METRICS

### **User Experience Metrics**
- **Completion Rate**: >85% users complete full analysis
- **Time to Value**: <3 minutes from upload to results
- **User Satisfaction**: 4.5+ star rating from user feedback
- **Return Usage**: 40%+ users return for multiple analyses
- **Mobile Usage**: 50%+ traffic from mobile devices

### **Technical Metrics**
- **Resume Parsing Accuracy**: >92% successful text extraction
- **AI Analysis Quality**: >90% confidence in domain detection
- **System Performance**: <3 seconds API response time
- **Uptime**: 99.9% availability
- **Export Success**: >95% successful resume downloads

### **Content Quality Metrics**
- **ATS Score Improvement**: Average +20 points after optimization
- **Keyword Integration**: 15+ relevant terms added per resume  
- **Market Relevance**: 85%+ alignment with job market requirements
- **User Feedback**: "Helpful" rating >90% for optimization suggestions

---

## 🔧 ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/resumeoptimizer"

# AI Services  
ANTHROPIC_API_KEY="your-claude-api-key"

# Optional Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-oauth-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"

# Optional Services
SENTRY_DSN="your-sentry-dsn-for-error-tracking"
```

---

## 📋 DEVELOPMENT CHECKLIST

### **Phase 1: Foundation** ✅
- [ ] Next.js 14 + TypeScript project setup
- [ ] Radix UI + Tailwind integration with radix-themes-tw
- [ ] Prisma database schema and connection
- [ ] Basic authentication (optional)
- [ ] Landing page with clear value proposition

### **Phase 2: Core Features** ✅
- [ ] File upload with drag-drop interface
- [ ] PDF text extraction functionality
- [ ] Claude AI integration for resume analysis
- [ ] Domain detection with confidence scoring
- [ ] Location selection with currency handling

### **Phase 3: Intelligence** ✅
- [ ] Job market scraping (LinkedIn/Indeed)
- [ ] Market trend analysis and insights
- [ ] Resume optimization with dual approach
- [ ] ATS scoring and compatibility check
- [ ] Skills gap analysis and recommendations

### **Phase 4: Results & Export** ✅
- [ ] Split-view results comparison
- [ ] Export functionality (PDF/DOCX/TXT)
- [ ] Success metrics tracking
- [ ] Error handling and user feedback
- [ ] Mobile responsive design

This complete PRD provides everything needed to build a **free, high-quality AI resume optimization platform** that delivers genuine value to product designers seeking better career opportunities! 🚀