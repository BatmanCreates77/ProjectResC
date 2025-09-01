# PROJECT_CONTEXT.md - ResumeOptimizer Pro
## Complete Context for Replit Development

**PROJECT**: ResumeOptimizer Pro - AI Resume Optimization SaaS  
**TARGET**: Product designers seeking jobs at Google, Apple, Meta, Figma, Stripe  
**BUDGET**: Optimized for minimal Replit AI interactions

---

## 🎯 BUSINESS OVERVIEW

**Problem**: Generic resume tools don't work for design roles, lack market intelligence  
**Solution**: AI-powered, design-specific optimization with real job market data  
**Market**: 50,000+ product designers actively job searching globally

**Revenue Model**:
- Free: 1 analysis per month (user acquisition)
- Pro ($29): Unlimited analyses, 3 domains, 2 regions, job link upload
- Premium ($99/mo): Real-time alerts, success tracking, unlimited everything

**Success Metrics**:
- Revenue: $20K MRR by month 6
- Users: 2,000+ registered users
- Conversion: 15% free-to-paid
- Satisfaction: 4.5+ star rating

---

## 🏗️ TECHNICAL ARCHITECTURE

**Stack**:
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS + Radix UI
Backend: Next.js API Routes + Prisma ORM
Database: PostgreSQL with connection pooling
AI: OpenAI GPT-4 for resume analysis and optimization
Payments: Stripe with webhooks
Scraping: Puppeteer for LinkedIn/Indeed job data
UI: Radix UI Themes for accessible, professional components
Deployment: Vercel with automatic scaling
```

**Key Dependencies**:
```json
{
  "next": "14.0.4",
  "@radix-ui/themes": "^2.0.3",
  "@radix-ui/react-icons": "^1.3.0",
  "@prisma/client": "^5.7.1",
  "openai": "^4.24.1",
  "stripe": "^14.9.0",
  "pdf-parse": "^1.1.1",
  "puppeteer": "^21.6.1",
  "next-auth": "^4.24.5",
  "zod": "^3.22.4"
}
```

---

## 📊 DATABASE SCHEMA (Prisma)

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String?
  freeAnalysesUsed Int       @default(0)
  isPremium        Boolean   @default(false)
  premiumExpiresAt DateTime?
  stripeCustomerId String?
  resumes          Resume[]
  analyses         Analysis[]
  payments         Payment[]
  createdAt        DateTime  @default(now())
  @@map("users")
}

model Resume {
  id           String     @id @default(cuid())
  userId       String
  fileName     String
  originalText String     @db.Text
  parsedData   Json
  uploadedAt   DateTime   @default(now())
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  analyses     Analysis[]
  @@map("resumes")
}

model Analysis {
  id                String   @id @default(cuid())
  resumeId          String
  userId            String
  targetDomains     String[]
  targetRegions     String[]
  targetLocation    String?
  targetCurrency    String?
  seniorityLevel    String
  experienceYears   Int
  atsScore          Int
  domainSuggestions Json
  skillGaps         Json
  optimizedContent  String?  @db.Text
  recommendations   Json
  jobMarketData     Json?
  salaryInsights    Json?
  customJobUrl      String?
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume            Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  @@map("analyses")
}

model JobPosting {
  id           String   @id @default(cuid())
  company      String
  title        String
  description  String   @db.Text
  requirements Json
  location     String
  domain       String
  salaryMin    Int?
  salaryMax    Int?
  currency     String   @default("usd")
  postedDate   DateTime
  scrapedAt    DateTime @default(now())
  isActive     Boolean  @default(true)
  sourceUrl    String?
  @@index([domain, location, isActive])
  @@map("job_postings")
}

model Payment {
  id              String   @id @default(cuid())
  userId          String
  stripeSessionId String   @unique
  amount          Int
  currency        String   @default("usd")
  status          String
  planType        String
  createdAt       DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id])
  @@map("payments")
}
```

---

## 🔄 COMPLETE USER JOURNEY

**Phase 1: Onboarding**
1. User signs up (email/Google OAuth)
2. Target location prompt: "Where are you looking for jobs?" (SF, London, Bangalore, NYC, Berlin)
3. Currency auto-detection based on location

**Phase 2: Resume Analysis**  
4. Drag-drop resume upload (PDF/TXT, max 5MB)
5. GPT-4 parsing: extract experience, skills, education, projects
6. Seniority detection: Junior/Mid/Senior/Staff (confidence score + reasoning)
7. Domain suggestions: B2B SaaS, Fintech, Healthcare, etc. with match explanations

**Phase 3: Market Intelligence**
8. User selects target domains (free: 1, pro: 3) and regions (free: 1, pro: 2)
9. PREMIUM: Option to paste specific job link for hyper-personalization
10. Job scraping from LinkedIn/Indeed filtered by domain+location+seniority
11. Display: "Analyzing 24 Senior Product Designer jobs in San Francisco from LinkedIn and Indeed"

**Phase 4: Optimization & Results**
12. Skills gap analysis: user skills vs market demand
13. Resume optimization using real job requirements + GPT-4
14. Results dashboard: ATS score, salary insights (local currency), recommendations
15. Export optimized resume (PDF/DOCX/TXT formats)

**Phase 5: Monetization**
16. Free users hit limit → upgrade prompt
17. Pro tier ($29): Stripe checkout → premium features unlock
18. Usage tracking and billing management

---

## 🎨 UI COMPONENTS (Radix UI Examples)

```typescript
// Essential Radix imports
import { Button, Card, TextField, Progress, Badge, Dialog, Flex, Grid, Text } from "@radix-ui/themes";
import { UploadIcon, StarIcon, CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";

// Upload Interface
<Card size="4" className="border-dashed">
  <Flex direction="column" align="center" gap="4">
    <UploadIcon size="32" />
    <Text>Drag your resume here or click to browse</Text>
    <Button><UploadIcon /> Choose File</Button>
    <Progress value={progress} />
  </Flex>
</Card>

// Domain Suggestions
<Grid columns="3" gap="4">
  <Card className="relative">
    <Badge className="absolute top-2 right-2" color="gold">
      <StarIcon /> Primary
    </Badge>
    <Text size="4" weight="bold">B2B SaaS</Text>
    <Progress value={94} />
    <Text size="1">94% match confidence</Text>
  </Card>
</Grid>

// Premium Feature Gate
{isPremium ? (
  <TextField.Root placeholder="Paste job URL">
    <TextField.Slot><LinkBreak2Icon /></TextField.Slot>
  </TextField.Root>
) : (
  <Callout.Root>
    <Callout.Icon><LockClosedIcon /></Callout.Icon>
    <Callout.Text>Upgrade to paste job links</Callout.Text>
  </Callout.Root>
)}
```

---

## 🚀 CORE FEATURES BREAKDOWN

### **1. Resume Upload & Parsing**
- Drag-drop with react-dropzone
- PDF text extraction with pdf-parse
- GPT-4 structured data extraction
- Validation and error handling

### **2. AI Analysis Engine**
- Experience calculation (handle overlaps)
- Seniority detection with confidence scoring
- Domain matching based on companies/keywords
- ATS score calculation (keywords, structure, quantification)

### **3. Job Market Intelligence**
- Puppeteer scraping of LinkedIn/Indeed
- Filter by domain + location + seniority
- Extract requirements, salary, company info
- Market trends and skills frequency analysis

### **4. Premium Job Link Feature**
- URL input and validation
- Custom job scraping from any job board
- Hyper-personalized optimization for specific role
- Feature gating with upgrade prompts

### **5. Salary Insights (Multi-Source)**
- Glassdoor API integration
- Levels.fyi data scraping
- LinkedIn salary insights
- Display in user's local currency (USD/GBP/INR/EUR/CAD/AUD)

### **6. Resume Optimization**
- GPT-4 content enhancement using market data
- Keyword integration from job requirements
- Achievement quantification suggestions
- Multiple optimization levels

### **7. Results Dashboard**
- ATS score with breakdown
- Skills gap visualization
- Domain fit assessment
- Salary benchmarking
- Actionable recommendations

### **8. Export System**
- PDF generation with formatting
- DOCX export capability
- Plain text version
- Multiple template options

### **9. Payment & Subscription**
- Stripe checkout integration
- Webhook payment confirmation
- Premium feature unlocking
- Usage tracking and limits

---

## 💡 KEY DIFFERENTIATORS

1. **Design-Specific**: Only tool for product designers vs generic resume tools
2. **Real Market Data**: Live job scraping vs outdated templates
3. **Regional Intelligence**: Location-specific salary and requirements
4. **Experience-Level Aware**: Appropriate suggestions for Junior/Senior/Staff
5. **Hyper-Personalization**: Premium job link feature for specific roles
6. **Multi-Currency**: Local currency salary insights (SF $180K vs Bangalore ₹25L)

---

## 🎯 SUCCESS REQUIREMENTS

**Technical**: 
- 92%+ resume parsing accuracy
- <3 second API response times  
- 99.9% uptime
- Mobile responsive (45% traffic)

**Business**:
- 15% free-to-paid conversion
- $20K MRR by month 6
- 4.5+ star user rating
- 65% user retention

**User Experience**:
- 85% complete analysis flow
- 70% domain suggestion adoption
- 8+ minute session duration
- 60% resume export rate

---

*This context provides everything needed to build ResumeOptimizer Pro efficiently in Replit with minimal token usage while maintaining full feature completeness and production quality.*