import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Disease } from '../../../models/disease.model';
import { DiseaseCardComponent } from '../disease-card/disease.component';
import { SHARED_IMPORTS } from '../../shared.module';

@Component({
  selector: 'app-card-carousel',
  standalone: true,
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.css'],
  imports: [DiseaseCardComponent, SHARED_IMPORTS]
})
export class CardCarouselComponent implements OnInit, OnDestroy {
  @Input() items: Disease[] = [];
  @Output() confirmDisease: EventEmitter<Disease> = new EventEmitter<Disease>();

  activeIndex: number = 0;

  // Using a more specific type for the intervalId instead of any.
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Auto-cycle the carousel every 5 seconds (5000 ms)
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  ngOnDestroy(): void {
    // Clear the interval to prevent memory leaks.
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

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
