import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextExtractorComponent } from '../text-extractor/text-extractor.component';
import { TextOutput } from '../../models/text-output.model';

@Component({
  selector: 'app-text-extractor-parent',
  standalone: true,
  imports: [CommonModule, RouterModule, TextExtractorComponent],
  templateUrl: './text-extractor-parent.component.html',
  styleUrls: ['./text-extractor-parent.component.css']
})
export class TextExtractorParentComponent {
  extractedTexts: TextOutput[] = [];
  currentText: TextOutput | null = null;
  errorMessage: string | null = null;

  onTextExtracted(text: TextOutput) {
    this.currentText = text;
    this.extractedTexts.push({ ...text });
    this.errorMessage = null;
    
    console.log('Text extracted:', {
      text: text.text.substring(0, 100) + '...',
      confidence: text.confidence,
      sourceType: text.sourceType
    });
  }

  onError(error: any) {
    this.errorMessage = error?.message || 'An error occurred while extracting text';
    console.error('Extraction error:', error);
  }

  clearResults() {
    this.currentText = null;
    this.extractedTexts = [];
    this.errorMessage = null;
  }

  downloadText() {
    if (!this.currentText?.text) return;
    
    const blob = new Blob([this.currentText.text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  copyToClipboard() {
    if (!this.currentText?.text) return;
    
    navigator.clipboard.writeText(this.currentText.text).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

