export interface RawData {
  [key: string]: any;
}

export interface ColumnInfo {
  name: string;
  type: 'number' | 'string' | 'date';
}

export interface AnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
}

export type ViewType = 'landing' | 'dashboard';
