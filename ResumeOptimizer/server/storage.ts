import { 
  users, 
  resumes, 
  analyses, 
  jobPostings,
  type User, 
  type InsertUser,
  type Resume,
  type InsertResume,
  type Analysis,
  type InsertAnalysis,
  type JobPosting,
  type InsertJobPosting
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  
  // Analysis operations
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getAnalysisByResume(resumeId: string): Promise<Analysis | undefined>;
  
  // Job posting operations
  createJobPosting(jobPosting: InsertJobPosting): Promise<JobPosting>;
  getJobPostingsByAnalysis(analysisId: string): Promise<JobPosting[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values(insertResume)
      .returning();
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  // Analysis operations
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || undefined;
  }

  async getAnalysisByResume(resumeId: string): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.resumeId, resumeId));
    return analysis || undefined;
  }

  // Job posting operations
  async createJobPosting(insertJobPosting: InsertJobPosting): Promise<JobPosting> {
    const [jobPosting] = await db
      .insert(jobPostings)
      .values(insertJobPosting)
      .returning();
    return jobPosting;
  }

  async getJobPostingsByAnalysis(analysisId: string): Promise<JobPosting[]> {
    return await db.select().from(jobPostings).where(eq(jobPostings.analysisId, analysisId));
  }
}

export const storage = new DatabaseStorage();
