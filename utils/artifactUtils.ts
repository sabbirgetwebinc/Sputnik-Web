import { ArtifactType } from '../types';

export const sanitizeArtifact = (artifact: string): string => {
  let cleaned = artifact.trim();
  
  // Remove defanging chars
  while(cleaned.includes("[.]")) {
    cleaned = cleaned.replace("[.]", ".");
  }

  if(cleaned.includes("hxxp://")) {
    cleaned = cleaned.replace("hxxp://", "http://");
  }

  if(cleaned.includes("hxxps://")) {
    cleaned = cleaned.replace("hxxps://", "https://");
  }
  
  return cleaned;
};

export const detectArtifactType = (artifact: string): ArtifactType => {
  if (!artifact) return ArtifactType.UNKNOWN;

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(artifact)) {
    return ArtifactType.IP;
  }

  // Basic Hash check by length (MD5=32, SHA1=40, SHA256=64)
  const hexRegex = /^[a-fA-F0-9]+$/;
  if ((artifact.length === 32 || artifact.length === 40 || artifact.length === 64) && hexRegex.test(artifact)) {
    return ArtifactType.HASH;
  }

  // Check for URL (starts with http/https)
  if (artifact.toLowerCase().startsWith('http://') || artifact.toLowerCase().startsWith('https://')) {
    return ArtifactType.URL;
  }

  // Fallback Domain regex (simplified)
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  if (domainRegex.test(artifact)) {
    return ArtifactType.DOMAIN;
  }

  return ArtifactType.UNKNOWN;
};

export const getArtifactLabel = (type: ArtifactType): string => {
  switch (type) {
    case ArtifactType.IP: return 'IP Address';
    case ArtifactType.DOMAIN: return 'Domain Name';
    case ArtifactType.HASH: return 'File Hash';
    case ArtifactType.URL: return 'URL';
    default: return 'Unknown Artifact';
  }
};