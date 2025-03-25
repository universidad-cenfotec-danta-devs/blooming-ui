import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantCardComponent } from '../plant-card/plant-card.component';
import { PlantCard } from '../../../interfaces/plant-card.interface';

// Extend the PlantCard interface to include a unique id.
interface PlantCardWithId extends PlantCard {
  id: number;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, PlantCardComponent],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  // Array of 6 cards; only 5 are visible at a time.
  // After each slide, the first card is removed and appended at the end,
  // so the active card is always at index 0.
  cards: PlantCardWithId[] = [
    { id: 0, image: 'assets/images/planta-1.png', name: 'Monstera' },
    { id: 1, image: 'assets/images/planta-2.png', name: 'Filodendro' },
    { id: 2, image: 'assets/images/planta-3.png', name: 'Plant 2' },
    { id: 3, image: 'assets/images/planta-4.png', name: 'Plant 3' },
    { id: 4, image: 'assets/images/planta-5.png', name: 'Plant 4' },
    { id: 5, image: 'assets/images/planta-6.png', name: 'Plant 5' },
  ];

  // currentActiveId is not needed here because the active card is always the first one.
  // The template binding uses [isActive]="i === 0".
  
  // Translate value for the container in percentage.
  // Each card occupies about 17% of the space (including margins).
  translateX: number = 0;

  // Enable or disable the transition effect for the carousel track.
  transitionEnabled: boolean = true;

  // Interval for auto-sliding.
  intervalId: any;

  ngOnInit(): void {
    // Auto-slide the carousel every 3 seconds.
    this.intervalId = setInterval(() => {
      this.slide();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Initiates the slide transition by updating the translateX value.
   * The CSS transition (e.g., 0.5s) will animate the carousel track.
   * After the transition, reordering is performed so that the active card remains at index 0.
   */
  slide(): void {
    this.transitionEnabled = true;
    // Trigger the slide animation by shifting the carousel.
    this.translateX = -17; // Adjust the slide distance as needed.

    // Delay the reordering until after the CSS transition has completed.
    setTimeout(() => {
      // Remove the first card and append its clone to the end.
      const firstCardClone = { ...this.cards[0] };
      this.cards = this.cards.slice(1);
      this.cards.push(firstCardClone);

      // Reset the translateX without transition for a seamless loop.
      this.transitionEnabled = false;
      this.translateX = 0;
    }, 500); // 500ms delay 
  }
}
