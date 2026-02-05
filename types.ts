
export interface TongueAnalysis {
  tongueColor: string;
  tongueShape: string;
  coatingColor: string;
  coatingTexture: string;
  overallCondition: string;
  tcmAnalysis: string;
  healthSuggestions: {
    diet: string[];
    lifestyle: string[];
    herbalReference?: string;
  };
  warnings: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
