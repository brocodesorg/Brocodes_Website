import { z } from 'zod';

// URL validation schema
const urlSchema = z.string().url();

// Project metadata schema
export const ProjectMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional().default('A featured project on BroCodes.'),
  description: z.string().optional(),
  category: z.string().optional().default('Software'),
  technologies: z.array(z.string()).optional().default([]),

  // Optional fields
  year: z.number().int().optional(),
  featured: z.boolean().optional(),

  // Media
  cover: z.string().optional(),
  screenshots: z.array(z.object({
    path: z.string(),
    alt: z.string().optional(),
  })).optional(),
  videoUrl: z.string().url().optional(),
  videoLocal: z.string().optional(),

  // Features and setup
  features: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  installation: z.array(z.string()).optional(),
  usage: z.array(z.string()).optional(),
  troubleshooting: z.array(z.object({
    issue: z.string(),
    solution: z.string(),
  })).optional(),

  // External links & GitHub repo
  liveUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  githubBranch: z.string().optional().default('main'),
  downloadUrl: z.string().url().optional(),

  // Download control
  enableDownload: z.boolean().optional().default(true),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;

// Processed project with additional computed fields
export interface Project extends ProjectMetadata {
  slug: string;
  readmeContent?: string;
  readmeHtml?: string;
  download?: {
    url: string;
    size?: number;
    sizeInMB?: string;
    isExternal?: boolean;
    label?: string;
  };
}
