import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextExtractorService } from '../../services/text-extractor.service';
import { TextOutput } from '../../models/text-output.model';

@Component({
  selector: 'app-text-extractor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-extractor.component.html'
})
export class TextExtractorComponent {

  @Output() textExtracted = new EventEmitter<TextOutput>();
  loading = false;

  constructor(private extractor: TextExtractorService) {}

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.loading = true;

    let result: TextOutput;

    if (file.type === 'application/pdf') {
      result = await this.extractor.extractFromPdf(file);
    } else {
      result = await this.extractor.extractFromImage(file);
    }

    this.textExtracted.emit(result);
    this.loading = false;
  }
}