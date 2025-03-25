import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Disease } from '../../../models/disease.model';
import { DiseaseCardComponent } from "../disease-card/disease.component";
import { SHARED_IMPORTS } from '../../shared.module';

@Component({
  selector: 'app-card-carousel',
  standalone: true,
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.css'],
  imports: [DiseaseCardComponent,SHARED_IMPORTS]
})
export class CardCarouselComponent {
  // Input property to receive the list of diseases.
  @Input() items: Disease[] = [];
  // Output event emitter to send the confirmed disease to the parent.
  @Output() confirmDisease: EventEmitter<Disease> = new EventEmitter<Disease>();

  // Current active card index.
  activeIndex: number = 0;

  // Emit the confirmed disease when a disease card's confirm button is clicked.
  onConfirmDisease(item: Disease): void {
    this.confirmDisease.emit(item);
  }

  // Move to the previous card.
  previous(): void {
    if (this.items.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
  }

  // Move to the next card.
  next(): void {
    if (this.items.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }
}
