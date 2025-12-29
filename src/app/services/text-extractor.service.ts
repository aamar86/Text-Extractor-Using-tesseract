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

  async extractFromPdf(file: File, lang = 'eng'): Promise<TextOutput> {
    // Ensure worker is configured before using PDF.js
    await this.configurePdfWorker();
    
    const pdfjsLib = await import('pdfjs-dist');
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    // First, try to extract text directly from PDF text layers
    let textFromLayers = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((i: any) => i.str).join(' ');
      textFromLayers += pageText + '\n';
    }

    // If we got substantial text from layers, use it (text-based PDF)
    // Otherwise, render pages as images and use OCR (scanned PDF)
    if (textFromLayers.trim().length > 50) {
      return {
        text: textFromLayers.trim(),
        sourceType: 'pdf'
      };
    }

    // For scanned PDFs, render each page and use OCR
    const tesseractWorker = await createWorker(lang);
    let fullText = '';
    let totalConfidence = 0;
    let pagesProcessed = 0;

    try {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR quality

        // Create canvas to render PDF page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/png');
        });

        // Use OCR on the rendered page
        const { data } = await tesseractWorker.recognize(blob);
        
        if (data.text.trim()) {
          fullText += `--- Page ${i} ---\n${data.text.trim()}\n\n`;
          totalConfidence += data.confidence || 0;
          pagesProcessed++;
        }
      }
    } finally {
      await tesseractWorker.terminate();
    }

    const averageConfidence = pagesProcessed > 0 ? totalConfidence / pagesProcessed : 0;

    return {
      text: fullText.trim() || textFromLayers.trim(),
      confidence: averageConfidence,
      sourceType: 'pdf'
    };
  }
}