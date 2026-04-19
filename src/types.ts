export type Tier = 'free' | 'pro';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  tier: Tier;
  creditsUsed: number;
  maxCredits: number;
  createdAt: string;
}

export type SectionType = 'SUMMARY' | 'CONCEPTS' | 'TIMELINE' | 'ACTION_PLAN' | 'TECHNICAL' | 'CRITIQUE' | 'GLOSSARY' | 'Q&A' | 'TABLE' | 'METAPHOR';

export interface AnalysisSection {
  type: SectionType;
  title: string;
  content: any; 
}

export interface AnalysisResult {
  title: string;
  sections: AnalysisSection[];
}

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  sections: AnalysisSection[];
  contentType: 'url' | 'text' | 'file' | 'audio' | 'video';
  source: string;
  createdAt: string;
  folderId?: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  body: string;
  createdAt: string;
}
