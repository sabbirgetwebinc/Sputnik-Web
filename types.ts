export enum ArtifactType {
  IP = 'IP',
  DOMAIN = 'DOMAIN',
  HASH = 'HASH',
  URL = 'URL',
  UNKNOWN = 'UNKNOWN'
}

export interface ServiceDefinition {
  id: string;
  name: string;
  urlBuilder: (artifact: string) => string;
  description?: string;
}

export interface AnalysisResult {
  markdown: string;
  loading: boolean;
  error?: string;
}