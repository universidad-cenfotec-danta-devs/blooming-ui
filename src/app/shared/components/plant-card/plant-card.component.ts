import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * @description
 * A single plant card. If `isActive` is true, it appears larger and shows a "Know more" button.
 */
@Component({
  selector: 'app-plant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.css']
})
export class PlantCardComponent {
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() isActive: boolean = false;
  
}
