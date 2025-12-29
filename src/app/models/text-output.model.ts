export interface TextOutput {
  text: string;
  confidence?: number;
  sourceType?: 'image' | 'pdf' | 'string';
}