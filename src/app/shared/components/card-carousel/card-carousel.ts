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
  @Input() items: Disease[] = [];
  @Output() confirmDisease: EventEmitter<Disease> = new EventEmitter<Disease>();

  activeIndex: number = 0;

  onConfirmDisease(item: Disease): void {
    this.confirmDisease.emit(item);
  }

  previous(): void {
    if (this.items.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
  }

  next(): void {
    if (this.items.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }
}
