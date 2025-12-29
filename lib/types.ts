
export interface Acronym {
  id: number;
  text: string;
  votes: number;
}

export interface BingoTile {
  text: string;
  marked: boolean;
}

export interface CampaignPost {
  id: string;
  platform: string;
  tone: string;
  campaignPhase: string;
  theme: string;
  postText: string;
  imageB64: string;
  imagePrompt: string;
  createdAt: string;
}

export interface SocialMetricEntry {
  id: string;
  platform: 'Instagram' | 'X (Twitter)' | 'TikTok' | 'YouTube' | 'Web/Blog';
  metricType: 'Alcance' | 'Interacciones' | 'Seguidores';
  value: number;
  date: string;
}

export interface SurrealConsultationResult {
  text: string;
  imageB64: string;
}

export interface SavedConsultation {
  id: string;
  query: string;
  responseText: string;
  responseImageB64: string;
  createdAt: string;
}

export interface PosterContent {
  headline: string;
  slogan: string;
  subtitle: string;
}

export interface DiplomaContent {
  title: string;
  body: string;
}

export interface ExclusiveContent {
  id: string;
  title: string;
  description: string;
  fileData: string; // Base64 encoded file with data URI scheme
  fileType: string; // MIME type
  fileName: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string; // Password is saved but not always exposed
}

export interface PageContentPillar {
  phase: string;
  title: string;
  description: string;
}

export interface AcronymGeneratorResult {
    acronyms: string[];
    explanation: string;
}

export interface SimulatorMessage {
    role: 'user' | 'model';
    text: string;
}

export interface SimulatorTurnResult {
    reply: string;
    patience: number; // 0-100
    dignity: number; // 0-100
    status: 'playing' | 'won' | 'lost';
}
