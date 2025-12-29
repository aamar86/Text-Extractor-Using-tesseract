import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { TextOutput } from '../models/text-output.model';

@Injectable({ providedIn: 'root' })
export class TextExtractorService {
  private pdfWorkerConfigured = false;

  private async configurePdfWorker() {
    if (this.pdfWorkerConfigured) return;
    
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker source to use local worker file from assets
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';
    this.pdfWorkerConfigured = true;
  }

  async extractFromImage(file: File, lang = 'eng'): Promise<TextOutput> {
    const worker = await createWorker(lang);
    const { data } = await worker.recognize(file);
    await worker.terminate();

    return {
      text: data.text,
      confidence: data.confidence,
      sourceType: 'image'
    };
  }

  async extractFromPdf(file: File): Promise<TextOutput> {
    // Ensure worker is configured before using PDF.js
    await this.configurePdfWorker();
    
    const pdfjsLib = await import('pdfjs-dist');
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((i: any) => i.str).join(' ');
      fullText += pageText + '\n';
    }

    return {
      text: fullText,
      sourceType: 'pdf'
    };
  }
}