export interface FixItem {
  title: string;
  description: string;
}

export interface RoastResult {
  heroAlias: string;
  powerScore: number; // 1 to 10
  verdictTitle: string;
  verdictSummary: string;
  roasts: string[];
  fixes: FixItem[];
  comicSoundEffect: string;
  heroQuote: string;
  analyzedUrl?: string;
  analyzedAt?: string;
}

export interface RoastRequest {
  imageBase64?: string;
  mimeType?: string;
  url?: string;
}

export interface PresetSample {
  id: string;
  name: string;
  tagline: string;
  url: string;
  badge: string;
  thumbnail: string;
  mockImageBase64?: string;
}
