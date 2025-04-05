import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantCardComponent } from '../plant-card/plant-card.component';
import { PlantCard } from '../../../interfaces/plant-card.interface';

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
  cards: PlantCardWithId[] = [
    { id: 0, image: 'assets/images/planta-1.png', name: 'Monstera' },
    { id: 1, image: 'assets/images/planta-2.png', name: 'Filodendro' },
    { id: 2, image: 'assets/images/planta-3.png', name: 'Plant 2' },
    { id: 3, image: 'assets/images/planta-4.png', name: 'Plant 3' },
    { id: 4, image: 'assets/images/planta-5.png', name: 'Plant 4' },
    { id: 5, image: 'assets/images/planta-6.png', name: 'Plant 5' },
  ];

  translateX: number = 0;

  transitionEnabled: boolean = true;

  intervalId: any;

  ngOnInit(): void {
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
    this.translateX = -17;

    setTimeout(() => {
      const firstCardClone = { ...this.cards[0] };
      this.cards = this.cards.slice(1);
      this.cards.push(firstCardClone);

      this.transitionEnabled = false;
      this.translateX = 0;
    }, 500);
  }
}
