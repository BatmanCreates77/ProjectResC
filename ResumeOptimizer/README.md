# ResumeOptimizer Pro 🚀

A free AI-powered resume optimization platform specifically designed for product designers seeking roles at top-tier companies like Google, Apple, Meta, and Figma.

## ✨ Features

- **AI-Powered Analysis**: Leverages Claude AI for intelligent resume parsing and optimization
- **Fallback System**: Robust rule-based parsing that works even when AI services are unavailable
- **Domain Matching**: Specialized analysis for B2B SaaS, Fintech, E-commerce, Healthcare, EdTech, and Consumer Apps
- **ATS Optimization**: Ensures resumes pass Applicant Tracking Systems
- **Modern Interface**: Premium glassmorphism design with responsive layout
- **Real-time Processing**: Instant analysis and optimization recommendations
- **Anonymous Usage**: No registration required - completely free

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling with custom glassmorphism effects
- **TanStack Query** for server state management
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** with Drizzle ORM
- **Anthropic Claude AI** for resume analysis
- **Multer** for file upload handling
- **pdf-parse** for PDF text extraction

### Infrastructure
- **Neon Database** for serverless PostgreSQL
- **Replit** for development and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resumeoptimizer-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Add your API keys:
DATABASE_URL="your-postgresql-connection-string"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── services/          # External service integrations
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🎯 Key Features

### Resume Analysis
- **Smart Parsing**: Extracts personal information, experience, skills, and projects
- **Domain Detection**: Identifies best-fit industries based on experience
- **Seniority Assessment**: Determines experience level and career progression
- **ATS Scoring**: Evaluates resume compatibility with tracking systems

### Optimization Recommendations
- **Impact Quantification**: Suggests adding metrics to achievements
- **Skill Highlighting**: Identifies in-demand skills to emphasize
- **Content Enhancement**: Provides improved versions of resume sections
- **Industry Alignment**: Tailors content for specific domains

### Fallback System
- **Regex-based Parsing**: Extracts information using pattern matching
- **Keyword Analysis**: Identifies skills and experience markers
- **Rule-based Classification**: Determines domains and seniority levels
- **Professional Templates**: Generates optimized resume content

## 🔒 Privacy & Security

- **Anonymous Usage**: No user accounts or personal data storage required
- **Secure Processing**: Files are processed in-memory and not permanently stored
- **API Security**: All external API calls use secure authentication
- **Data Protection**: Resume content is not logged or cached

## 🚀 Deployment

### Replit Deployment
The application is optimized for Replit deployment with automatic configuration.

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Start the production server:
```bash
npm start
```

## 📊 Performance

- **Fast Processing**: Optimized for quick resume analysis
- **Efficient Bundling**: Vite ensures minimal bundle sizes
- **Caching Strategy**: Smart caching with TanStack Query
- **Responsive Design**: Mobile-first approach for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For questions or support, please open an issue on GitHub.

---

**ResumeOptimizer Pro** - Empowering product designers with AI-driven career optimization 🎨✨